const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
