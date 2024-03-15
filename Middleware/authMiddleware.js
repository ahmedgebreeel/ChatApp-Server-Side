const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // )
  //  {
  //   try {
  //     token = req.headers.authorization.split(" ")[1];

  //     //decodes token id

  //     req.user = await User.findById(decoded.id).select("-password");

  //     next();
  //   } catch (error) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(new ApiError('token is not true', 401))
  }
  //     res.status(401);
  //     throw new Error("Not authorized, token failed");
  //   }
  // }
  console.log("line" + decoded.id);

  if (!token) {
    return next(new ApiError("Not authorized, no token", 401));
  }
  next();

});
// console.log(protect);
module.exports = { protect };