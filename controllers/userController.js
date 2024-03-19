const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const AppError = require("../utils/appError");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const singup = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    return next(new AppError("this user already exists", 400))
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = signToken(newUser._id);
  res.status(201).header("Authorization", `Bearer ${token}`).json({
    success: true,
    message: "Sign up successful",
    token,
    userName: newUser.name
  });
})

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError("Email or password is not correct", 401));
  }
  const token = signToken(user.id);
  res.header("Authorization", `Bearer ${token}`);
  res.status(200).json({ success: true, message: "Login successful", token, userName: user.name });
})

const getusers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

const getUserByID = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const SpasificUSer = await User.findById(userId);
  if (!SpasificUSer) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json(SpasificUSer);
});

module.exports = { singup, login, getusers, getUserByID };
