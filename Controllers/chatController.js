const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const Message = require("../models/messageModel");


//#region for crteate chat
const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    return next(new AppError(`UserId not send`, 400));
  }
  //#region for find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("latestMessage");

  // console.log(ischat);
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    // console.log(message[0]);
    return res.send(message);
  }
  // #endregion
  else {
    const createdChat = await Chat.create({
      chatName: "sender",
      users: [req.user._id, userId]
    });
    const FullChat = await Chat.findOne({ _id: createdChat._id })
    res.status(201).json(FullChat._id);


  }
})
// #endregion

//#region for get chat

const getChats = asyncHandler(async (req, res, next) => {
  const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).sort("-updatedAt").populate("latestMessage")
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
  if (users.length < 2) {
    return next(new AppError("More than 2 users are required to form a group chat", 400));
  }
  const user = req.user._id
  users.push(user);
  //#region for find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    $and: [
      { users: { $eq: users } },
    ],
  })
  // console.log(ischat[0]);
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    // console.log(message[0]);
    return res.send(message);
  }
  // #endregion
  else {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      groupAdmin: user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    // console.log(fullGroupChat);
    res.status(201).json(fullGroupChat._id);

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
