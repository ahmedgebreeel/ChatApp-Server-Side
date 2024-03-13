const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/appError');
const accessChat = asyncHandler(async (req, res) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  console.log(user);
  const { userId } = req.body;
  console.log(userId);
  const ischat = await Chat.find({
    isGroupChat: false, $and: [
      { users: { $elemMatch: { $eq: user } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
  console.log(ischat);

  if (ischat.length > 0) {
    return res.send(ischat[0]);
  }
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

const getChats = asyncHandler(async (req, res) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  console.log(user);
  const results = await Chat.find({ users: { $elemMatch: { $eq: user } } }).sort("-updatedAt")
  res.status(200).json(results);
})

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return next(new ApiError("Please Fill all the feilds", 400));
  }
  var { users } = req.body
  console.log(users);
  if (users.length < 2) {
    return next(new ApiError("More than 2 users are required to form a group chat", 400));
  }
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id
  users.push(user);
  const ischat = await Chat.find({
    isGroupChat: true,
    $and: [
      { users: { $eq: users } },
    ],
  })

  if (ischat.length > 0) {
    return res.send(ischat[0]);
  }
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
const addToGroup = asyncHandler(async (req, res) => {
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
    return next(new ApiError("Chat Not Found", 404));
  }
  res.status(200).json(added);
});

module.exports = { accessChat, getChats, createGroupChat, addToGroup };
