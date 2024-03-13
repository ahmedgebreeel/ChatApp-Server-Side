const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/appError');


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




const singup = asyncHandler(async (req, res) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res)

})

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new ApiError("Email or password is not correct", 401));
  }
  createSendToken(user, 200, res)

})

const getusers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);

});
const getUserByID = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const SpasificUSer = await User.findById(userId);
  if (!SpasificUSer) {
    return next(new ApiError('No user found with that ID', 404));
  }
  res.status(200).json(SpasificUSer);
});


module.exports = { singup, login, getusers, getUserByID };
