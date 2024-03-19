const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

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
  res.status(201).json({ newMessage })
})

module.exports = { sendMessage };
