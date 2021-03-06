const e = require("express");
const { findById } = require("../../models/tweet");
const Tweet = require("../../models/tweet"),
  Follower = require("../../models/followers"),
  twitterTextUtil = require("twitter-text"),
  User = require("../../models/user"),
  TweetLike = require("../../models/tweetLike"),
  Hashtag = require("../../models/hashtag");

//Retrieving tweets for the people the user following, userId from req.user._id
exports.getTweetsFeed = async (req, res, next) => {
  const tweets = await Follower.aggregate(
    [
      { $match: { userId: req.user._id } },
      {
        $lookup: {
          from: "tweets",
          localField: "followingId",
          foreignField: "authorId",
          as: "tweets",
        },
      },
      { $project: { tweets: 1, _id: 0 } },
      {
        $lookup: {
          let: {
            userSearchId: { $toString: req.user._id },
          },
          from: "tweets",
          pipeline: [
            { $match: { $expr: { $eq: ["$authorId", "$$userSearchId"] } } },
          ],
          as: "tweetss",
        },
      },
      { $unwind: "$tweets" },
      { $unwind: "$tweetss" },

      {
        $group: {
          _id: null,
          tweet: { $addToSet: "$tweets" },
          tweets: { $addToSet: "$tweetss" },
        },
      },
      {
        $project: { tweet: { $concatArrays: ["$tweet", "$tweets"] } },
      },
      { $unwind: "$tweet" },
      { $sort: { "tweet.createdAt": -1 } },
      {
        $lookup: {
          let: {
            searchId: { $toString: "$tweet._id" },
          },
          from: "tweetlikes",
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$searchId"] } } },
            { $count: "likesCount" },
          ],
          as: "tweetLikes",
        },
      },

      {
        $set: {
          "tweet.tweetStats": {
            $cond: [
              { $eq: ["$tweetLikes", []] },
              { likesCount: 0 },
              { $first: "$tweetLikes" },
            ],
          },
        },
      },
      {
        $lookup: {
          let: {
            userSearchId: { $toString: req.user._id },
            searchId: { $toString: "$tweet._id" },
          },
          from: "tweetlikes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tweetId", "$$searchId"] },
                    { $eq: ["$userId", "$$userSearchId"] },
                  ],
                },
              },
            },
          ],
          as: "liked",
        },
      },
      {
        $set: {
          isLiked: {
            $cond: [{ $eq: ["$liked", []] }, false, true],
          },
        },
      },
      {
        $set: {
          "tweet.isLiked": "$isLiked",
        },
      },
      {
        $lookup: {
          let: { searchId: { $toObjectId: "$tweet.authorId" } },
          from: "users",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
            {
              $project: {
                password: 0,
                dateOfBirth: 0,
                gender: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: "authorInfo",
        },
      },
      {
        $addFields: { authorInfo: { $first: "$authorInfo" } },
      },
      {
        $project: {
          _id: 0,
          tweetLikes: 0,
          isLiked: 0,
          liked: 0,
        },
      },
    ],
    function (err, tweets) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, tweets });
    }
  );
};

// Retrieving user tweets, userId passed in req.body
exports.getUserTweets = async (req, res, next) => {
  let { userId } = req.query;
  let tweets = await Tweet.aggregate(
    [
      { $match: { authorId: userId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          let: { searchId: { $toString: "$_id" } },
          from: "tweetlikes",
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$searchId"] } } },
            { $count: "likesCount" },
          ],
          as: "tweetLikes",
        },
      },
      {
        $set: {
          tweetStats: {
            $cond: [
              { $eq: ["$tweetLikes", []] },
              { likesCount: 0 },
              { $first: "$tweetLikes" },
            ],
          },
        },
      },
      {
        $lookup: {
          let: {
            userSearchId: { $toString: req.user._id },
            searchId: { $toString: "$_id" },
          },
          from: "tweetlikes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tweetId", "$$searchId"] },
                    { $eq: ["$userId", "$$userSearchId"] },
                  ],
                },
              },
            },
          ],
          as: "liked",
        },
      },
      {
        $set: {
          isLiked: {
            $cond: [{ $eq: ["$liked", []] }, false, true],
          },
        },
      },
      {
        $project: {
          liked: 0,
          tweetLikes: 0,
        },
      },
    ],
    function (err, tweets) {
      if (err) return res.status(400).json({ errors: [err] });
      if (tweets) {
        return res.status(200).json({ success: true, tweets });
      } else {
        return res.status(200).json({ success: true, tweets: [] });
      }
    }
  );
};

// Adding new Tweet
exports.addTweet = async (req, res, next) => {
  //destructuring fields
  let { content, media } = req.body;
  let { _id } = req.user;

  const hashtags = twitterTextUtil.extractHashtags(content);
  const mentions = twitterTextUtil.extractMentions(content);
  let correctMentions = [];

  const users = await User.find({ username: { $in: mentions } }).then(
    (users) => {
      if (users.length > 0) {
        users.forEach((user) => {
          correctMentions.push(user.username);
        });
      }
    }
  );

  //   creating new tweet
  let tweet = await Tweet({
    author: _id,
    authorId: _id,
    content,
    entities: {
      hashtags,
      mentions: correctMentions,
    },
    media,
  }).save(async function (err, savedTweet) {
    if (err) return res.status(400).json({ errors: [err] });
    // Create hashtag
    savedTweet.entities.hashtags.forEach(async (hashtag) => {
      let hash = await Hashtag.findOneAndUpdate(
        { content: hashtag, tweetIds: { $ne: savedTweet._id } },
        { $push: { tweetIds: savedTweet._id } },
        { new: true, upsert: true }
      );
    });

    const tweet = await Tweet.aggregate(
      [
        {
          $match: { $expr: { $eq: ["$_id", savedTweet._id] } },
        },
        {
          $addFields: { tweet: savedTweet },
        },
        { $unwind: "$tweet" },
        { $project: { tweet: 1, _id: 0 } },
        {
          $lookup: {
            let: { searchId: { $toString: "$tweet._id" } },
            from: "tweetlikes",
            pipeline: [
              { $match: { $expr: { $eq: ["$tweetId", "$$searchId"] } } },
              { $count: "likesCount" },
            ],
            as: "tweetLikes",
          },
        },
        {
          $set: {
            "tweet.tweetStats": {
              $cond: [
                { $eq: ["$tweetLikes", []] },
                { likesCount: 0 },
                { $first: "$tweetLikes" },
              ],
            },
          },
        },
        {
          $lookup: {
            let: {
              userSearchId: { $toString: req.user._id },
              searchId: { $toString: "$tweet._id" },
            },
            from: "tweetlikes",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$tweetId", "$$searchId"] },
                      { $eq: ["$userId", "$$userSearchId"] },
                    ],
                  },
                },
              },
            ],
            as: "liked",
          },
        },
        {
          $set: {
            isLiked: {
              $cond: [{ $eq: ["$liked", []] }, false, true],
            },
          },
        },
        {
          $set: {
            "tweet.isLiked": "$isLiked",
          },
        },
        {
          $lookup: {
            let: { searchId: { $toObjectId: savedTweet.authorId } },
            from: "users",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
              {
                $project: {
                  password: 0,
                  dateOfBirth: 0,
                  gender: 0,
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
            as: "authorInfo",
          },
        },
        {
          $addFields: { authorInfo: { $first: "$authorInfo" } },
        },
        {
          $project: {
            _id: 0,
            // tweetLikes: 0,
            // isLiked: 0,
            // liked: 0,
          },
        },
      ],
      function (err, tweet) {
        if (err) return res.status(400).json({ errors: [err] });
        return res
          .status(200)
          .json({ success: true, message: "Added Tweet", tweet });
      }
    );
  });
};

// Like Tweet passed as payload tweetId
exports.likeTweet = async (req, res, next) => {
  const { tweetId } = req.body;
  const doc = await TweetLike.findOne({
    tweetId,
    userId: req.user._id.toString(),
  })
    .then((doc) => {
      if (doc) {
        return res
          .status(400)
          .json({ success: false, message: "You liked this tweet already." });
      } else {
        const tweetLike = TweetLike({
          tweetId,
          userId: req.user._id.toString(),
        }).save(async function (err, doc) {
          if (err) return res.status(400).json({ errors: [err] });
          return res
            .status(200)
            .json({ success: true, message: "Like Tweet!" });
        });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Like Tweet passed as payload tweetId
exports.disLikeTweet = async (req, res, next) => {
  const { tweetId } = req.body;
  const doc = await TweetLike.findOne({
    tweetId,
    userId: req.user._id.toString(),
  })
    .then((doc) => {
      if (!doc) {
        return res
          .status(400)
          .json({ success: false, message: "You didn't like this tweet" });
      } else {
        if (doc.userId === req.user._id.toString()) {
          doc.remove();
          return res
            .status(200)
            .json({ success: true, message: "Disliked Tweet Successfully." });
        } else {
          return res.status(401).json({ errors: ["You'r not authorized..."] });
        }
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Deleting Tweet passed as payload tweetId
exports.deleteTweet = async (req, res, next) => {
  const { tweetId } = req.body;
  let tweet = await Tweet.findById(tweetId)
    .then((doc) => {
      if (!doc) {
        return res.status(400).json({ errors: [`Couldn't find that tweet.`] });
      } else {
        if (doc.authorId.toString() === req.user._id) {
          doc.remove();
          return res
            .status(200)
            .json({ success: true, message: "Deleted Tweet Successfully." });
        } else {
          return res
            .status(401)
            .json({ errors: ["You'r not authorized to delete this tweet."] });
        }
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Get tweets by hashtag
exports.getTweetsByHashtag = async (req, res, next) => {
  const { hashtagQuery } = req.params;
  const tweets = await Tweet.aggregate(
    [
      {
        $project: {
          tweet: "$$ROOT",
          hashtagPresent: {
            $gt: [
              {
                $size: {
                  $setIntersection: ["$entities.hashtags", [hashtagQuery]],
                },
              },
              0,
            ],
          },
        },
      },
      {
        $match: { $expr: { $eq: ["$hashtagPresent", true] } },
      },
      {
        $project: {
          _id: 0,
          hashtagPresent: 0,
        },
      },
      { $sort: { "tweet.createdAt": -1 } },
      {
        $lookup: {
          let: {
            searchId: { $toString: "$tweet._id" },
          },
          from: "tweetlikes",
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$searchId"] } } },
            { $count: "likesCount" },
          ],
          as: "tweetLikes",
        },
      },

      {
        $set: {
          "tweet.tweetStats": {
            $cond: [
              { $eq: ["$tweetLikes", []] },
              { likesCount: 0 },
              { $first: "$tweetLikes" },
            ],
          },
        },
      },
      {
        $lookup: {
          let: {
            userSearchId: { $toString: req.user._id },
            searchId: { $toString: "$tweet._id" },
          },
          from: "tweetlikes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tweetId", "$$searchId"] },
                    { $eq: ["$userId", "$$userSearchId"] },
                  ],
                },
              },
            },
          ],
          as: "liked",
        },
      },
      {
        $set: {
          isLiked: {
            $cond: [{ $eq: ["$liked", []] }, false, true],
          },
        },
      },
      {
        $set: {
          "tweet.isLiked": "$isLiked",
        },
      },
      {
        $lookup: {
          let: { searchId: { $toObjectId: "$tweet.authorId" } },
          from: "users",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
            {
              $project: {
                password: 0,
                dateOfBirth: 0,
                gender: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: "authorInfo",
        },
      },
      {
        $addFields: { authorInfo: { $first: "$authorInfo" } },
      },
      {
        $project: {
          _id: 0,
          tweetLikes: 0,
          isLiked: 0,
          liked: 0,
        },
      },
    ],
    function (err, tweets) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, tweets });
    }
  );
};

// Get Top hashtags
exports.getTopHashtags = async (req, res, next) => {
  const hashtags = await Hashtag.aggregate(
    [
      { $project: { _id: 1, content: 1, tweetsCount: { $size: "$tweetIds" } } },
      { $sort: { tweetsCount: -1 } },
      { $limit: 3 },
    ],
    function (err, hashtags) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, hashtags });
    }
  );
};

// Get Specific Tweet
exports.getTweet = async (req, res, next) => {
  const { tweetId } = req.params;

  const tweets = await Tweet.aggregate(
    [
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: tweetId }] } } },
      {
        $lookup: {
          let: {
            searchId: { $toString: "$_id" },
          },
          from: "tweetlikes",
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$searchId"] } } },
            { $count: "likesCount" },
          ],
          as: "tweetLikes",
        },
      },

      {
        $set: {
          tweetStats: {
            $cond: [
              { $eq: ["$tweetLikes", []] },
              { likesCount: 0 },
              { $first: "$tweetLikes" },
            ],
          },
        },
      },
      {
        $lookup: {
          let: {
            userSearchId: { $toString: req.user._id },
            searchId: { $toString: "$_id" },
          },
          from: "tweetlikes",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tweetId", "$$searchId"] },
                    { $eq: ["$userId", "$$userSearchId"] },
                  ],
                },
              },
            },
          ],
          as: "liked",
        },
      },
      {
        $set: {
          isLiked: {
            $cond: [{ $eq: ["$liked", []] }, false, true],
          },
        },
      },
      {
        $set: {
          isLiked: "$isLiked",
        },
      },
      {
        $lookup: {
          let: { searchId: { $toObjectId: "$authorId" } },
          from: "users",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
            {
              $project: {
                password: 0,
                dateOfBirth: 0,
                gender: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: "authorInfo",
        },
      },
      {
        $addFields: { authorInfo: { $first: "$authorInfo" } },
      },
      {
        $project: {
          tweetLikes: 0,
          liked: 0,
        },
      },
    ],
    function (err, tweet) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, tweet: tweet[0] });
    }
  );
};
