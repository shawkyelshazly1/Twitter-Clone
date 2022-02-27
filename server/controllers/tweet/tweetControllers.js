const e = require("express");
const { findById } = require("../../models/tweet");
const Tweet = require("../../models/tweet"),
  Follower = require("../../models/followers");
twitterTextUtil = require("twitter-text");

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
      { $unwind: "$tweets" },
      {
        $group: {
          _id: null,
          tweet: { $push: "$tweets" },
        },
      },
      { $unwind: "$tweet" },
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
        },
      },

      // {
      //   $project: {
      //     _id: 0,
      //   },
      // },

      // {
      //   $lookup: {
      //     from: "followers",
      //     localField: "authorId",
      //     foreignField: "followingId",
      //     as: "relationship",
      //   },
      // },
      // { $match: { "relationship.0.userId": req.user._id } },
      // // { $unset: "relationship" },
      // // // {
      // //   $lookup: {
      // //     let: { author: { $toObjectId: "$authorId" } },
      // //     from: "users",
      // //     pipeline: [
      // //       { $match: { $expr: { $eq: ["$_id", "$$author"] } } },
      // //       {
      // //         $project: {
      // //           password: 0,
      // //           dateOfBirth: 0,
      // //           gender: 0,
      // //         },
      // //       },
      // //     ],
      // //     as: "authorInfo",
      // //   },
      // // },
      // // {
      // //   $replaceRoot: {
      // //     newRoot: {
      // //       $mergeObjects: [
      // //         "$$ROOT",
      // //         { authorInfo: { $arrayElemAt: ["$authorInfo", 0] } },
      // //       ],
      // //     },
      // //   },
      // // },
    ],
    function (err, tweets) {
      if (err) return res.status(400).json({ errors: [err] });
      return res.status(200).json({ success: true, tweets });
    }
  );
};

// Retrieving user tweets, userId passed in req.body
exports.getUserTweets = async (req, res, next) => {
  let { userId } = req.body;

  let tweets = await Tweet.find({ userId })
    .then((docs) => {
      if (docs) {
        return res.status(200).json({ success: true, tweets: docs });
      } else {
        return res.status(200).json({ success: true, tweets: [] });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Adding new Tweet
exports.addTweet = async (req, res, next) => {
  //destructuring fields
  let { content } = req.body;
  let { _id } = req.user;
  const hashtags = twitterTextUtil.extractHashtags(content);
  const mentions = twitterTextUtil.extractMentions(content);

  //   creating new tweet
  let tweet = await Tweet({
    author: _id,
    authorId: _id,
    content,
    entities: {
      hashtags,
      mentions,
    },
  }).save(function (err, tweet) {
    if (err) return res.status(400).json({ errors: [err] });
    return res.status(200).json({ success: true, message: "Added Tweet" });
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
        if (doc.userId.toString() === req.user._id) {
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
