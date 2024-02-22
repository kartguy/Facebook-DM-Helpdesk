const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  custId: {
    type: String,
    required: true,
  },
  messages: [
    {
      msgId: String,
      message: String,
      created_time: String,
      from: {
        senderId: String,
        senderName: String,
        senderEmail: String,
      },
    },
  ],
});

const Message = mongoose.model("message", messagesSchema);

module.exports = {
  Message
}