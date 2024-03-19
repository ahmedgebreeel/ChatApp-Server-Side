const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const Message = require("../models/messageModel");

const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new AppError(`UserId not send`, 400));
  }
  // find if this chat aleary exist don't create a new one
  const ischat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("latestMessage");
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    return res.send({ message, chatId: ischat[0]._id });
  }
  else {
    const createdChat = await Chat.create({
      chatName: "sender",
      users: [req.user._id, userId]
    });
    const chatId = await Chat.findOne({ _id: createdChat._id })._id
    res.status(201).json({ message: [], chatId });
  }
})

const getChats = asyncHandler(async (req, res, next) => {
  const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).sort("-updatedAt").populate("latestMessage")
  res.status(200).json(results);
})

const createGroupChat = asyncHandler(async (req, res, next) => {
  var { users } = req.body
  if (!req.body.users || !req.body.name) {
    return next(new AppError("Please Fill all the feilds", 400));
  }
  if (users.length < 2) {
    return next(new AppError("More than 2 users are required to form a group chat", 400));
  }
  const user = req.user._id
  users.push(user);
  //find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    $and: [
      { users: { $eq: users } },
    ],
  })
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    return res.send({ message, chatId: ischat[0]._id });
  }
  else {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      groupAdmin: user,
    });
    const chatId = await Chat.findOne({ _id: groupChat._id })._id
    res.status(201).json({ message: [], chatId });
  }
})

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

module.exports = { accessChat, getChats, createGroupChat, addToGroup };
