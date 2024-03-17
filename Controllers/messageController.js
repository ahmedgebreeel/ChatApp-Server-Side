const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const jwt = require("jsonwebtoken");
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

//#region for sendMessage
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body
  if (!content || !chatId) {
    return next(new AppError("Invalid Data", 400))
  }
  const newMessage = await Message.create({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });
  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: newMessage });
  // console.log(late);
  res.status(201).json({ newMessage })

})
// #endregion

//#region for getAllMessages
// #endregion

module.exports = { sendMessage };
