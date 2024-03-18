const mongoose = require("mongoose");
//#region for chat schema
const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    // isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
// #endregion

//#region for Population
chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'users',
  });
  next();
});
// #endregion

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;