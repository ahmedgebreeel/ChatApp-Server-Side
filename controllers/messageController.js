const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const BadReqError = require("../errors/BadReqError")

const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body
  if (!content || !chatId) {
    return next(new BadReqError("Invalid Data"))
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
