const mongoose = require("mongoose");

// Creating Tweet Like Schema
const tweetLike = mongoose.Schema(
  {
    tweetId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TweetLike", tweetLike);
