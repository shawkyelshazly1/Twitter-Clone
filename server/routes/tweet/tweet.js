const router = require("express").Router(),
  {
    validateCookieToken,
    validateTweetPayload,
  } = require("../../utils/middlewares"),
  {
    addTweet,
    deleteTweet,
    getTweetsFeed,
    getUserTweets,
    disLikeTweet,
    likeTweet,
  } = require("../../controllers/tweet/tweetControllers");

//Retrieving tweets for the people the user following
router.get("/", validateCookieToken, getTweetsFeed);

// Retrieving user tweets, userId passed in req.body
router.get("/:user_handler", validateCookieToken, getUserTweets);

// Adding new Tweet
router.post("/", validateCookieToken, validateTweetPayload, addTweet);

// Deleting Tweet passed as payload tweetId
router.delete("/:tweetId", validateCookieToken, deleteTweet);

// Like Tweet
router.post("/:tweetId/like", validateCookieToken, likeTweet);

// DisLike Tweet
router.post("/:tweetId/dislike", validateCookieToken, disLikeTweet);

module.exports = router;
