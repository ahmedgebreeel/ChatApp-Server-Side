const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const jwt = require("jsonwebtoken");
const Message = require('../Models/messageModel');
const Chat = require('../Models/chatModel');

//#region for sendMessage
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).id

  if (!content || !chatId) {
    return next(new AppError("Invalid Data", 400))
  }
  const newMessage = await Message.create({
    sender: user,
    content: content,
    chat: chatId,
  });
  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: newMessage });
  // console.log(late);
  res.status(201).json({ newMessage })

})
// #endregion

//#region for getAllMessages
const getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params
  const message = await Message.find({ chat: chatId })
  res.status(200).json(message)

})
// #endregion

module.exports = { sendMessage, getMessages };
