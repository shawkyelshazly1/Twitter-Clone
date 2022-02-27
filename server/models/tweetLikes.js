const mongoose = require("mongoose");

// Creating Tweet Like Schema
const tweetLike = mongoose.Schema(
  {
    tweetId: { type: mongoose.SchemaTypes.ObjectId, ref: "Tweet" },
    likedUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TweetLikes", tweetLike);
