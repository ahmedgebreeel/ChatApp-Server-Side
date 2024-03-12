const User = require("../Models/userModel");
const jwt = require("jsonwebtoken")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure:true,
    httpOnly: true
  };
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};



const singup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "user Aleardy Exists!" })
    }
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All field are required ...." })
    }
    const newUser = new User({ name, email, password });
    const savedNewUser = await newUser.save();
    signToken(savedNewUser._id)
    createSendToken(savedNewUser, 201, res)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPass(password, user.password))) {
      return res.status(401).json({ error: "Email or password is not correct" });
    }
    createSendToken(user, 200, res)
  }
  catch (error) {
    res.status(401).json({ error: error.message })
  }
}


module.exports = { singup, login };
