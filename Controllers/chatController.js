const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');


//#region for crteate chat
const accessChat = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  console.log(user);
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    return next(new AppError(`UserId not send`, 400));
  }
  //#region for find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    isGroupChat: false, $and: [
      { users: { $elemMatch: { $eq: user } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("latestMessage");

  console.log(ischat);

  if (ischat.length > 0) {
    return res.send(ischat[0]);
  }
  // #endregion
  else {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [user, userId]
    });
    const FullChat = await Chat.findOne({ _id: createdChat._id })
    res.status(201).json(FullChat);


  }
})
// #endregion

//#region for get chat

const getChats = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  console.log(user);
  const results = await Chat.find({ users: { $elemMatch: { $eq: user } } }).sort("-updatedAt").populate("latestMessage")

  res.status(200).json(results);
})
// #endregion


//#region for crteate chatGroup
const createGroupChat = asyncHandler(async (req, res, next) => {
  var { users } = req.body
  console.log(users);
  if (!req.body.users || !req.body.name) {
    return next(new AppError("Please Fill all the feilds", 400));
  }
  console.log("length" + users.length);
  if (users.length < 2) {
    return next(new AppError("More than 2 users are required to form a group chat", 400));
  }
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  users.push(user);
  //#region for find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    isGroupChat: true,
    $and: [
      { users: { $eq: users } },
    ],
  })

  if (ischat.length > 0) {
    return res.send(ischat[0]);
  }
  // #endregion
  else {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    res.status(201).json(fullGroupChat);

  }
})
// #endregion


//#region for add user to chatGroup
const addToGroup = asyncHandler(async (req, res, next) => {
  const chatId = req.params.id;
  const { userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    })

  if (!added) {
    return next(new AppError("Chat Not Found", 404));
  }
  res.status(200).json(added);
});
// #endregion


module.exports = { accessChat, getChats, createGroupChat, addToGroup };
