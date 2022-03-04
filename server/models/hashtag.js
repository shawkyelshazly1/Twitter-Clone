const mongoose = require("mongoose");

const hashtagSchema = mongoose.Schema({
  content: { type: String, required: true, trim: true },
  tweetIds: [{ type: mongoose.SchemaTypes.ObjectId, required: true }],
});

module.exports = mongoose.model("Hashtag", hashtagSchema);
