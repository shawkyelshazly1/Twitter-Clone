const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    members: [
      { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
