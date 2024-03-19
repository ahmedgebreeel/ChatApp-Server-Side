const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    var decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new AppError('token is not true', 401))
    }
  }
  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }
  const stillUser = await User.findById(decoded.id);
  req.user = stillUser
  next();
});

module.exports = { protect };