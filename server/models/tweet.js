const mongoose = require("mongoose");

// Creating Tweet Schema
const tweetSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    authorId: { type: String, required: true },
    content: { type: String, required: true, minLength: 3, maxLength: 280 },
    entities: {
      type: {
        hashtags: [{ type: String, minLength: 1, maxLength: 279 }],
        mentions: [{ type: String, minLength: 5, maxLength: 30 }],
      },
    },
  },
  { timestamps: true }
);

tweetSchema.methods.getLikesCount = async function () {
  return "test";
};

module.exports = mongoose.model("Tweet", tweetSchema);
