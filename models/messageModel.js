const mongoose = require("mongoose");

//#region for message schema
const messageSchema = mongoose.Schema(
  {
    sender: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    content: { type: String, trim: true },

    chat: { type: mongoose.Schema.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);
// #endregion

//#region for population
messageSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'chat',

  // });
  this.populate({
    path: 'sender'
    , select: 'name'
  });
  next();
});
// #endregion

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;