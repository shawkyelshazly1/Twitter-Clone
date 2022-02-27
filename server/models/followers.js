const mongoose = require("mongoose");

// Creating Follower Schema
const followerSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    followingId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follower", followerSchema);
