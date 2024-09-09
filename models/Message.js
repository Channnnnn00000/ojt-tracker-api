const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    SenderConversationId: String,
    ReceiverConversationId: String,
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Message", MessageSchema);

module.exports = Messages;
