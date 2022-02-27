const e = require("express");
const User = require("../../models/user"),
  Follower = require("../../models/followers");

// Function loading current loggedin user information
exports.getUserProfile = async (req, res, next) => {
  let user = await User.findById(req.user._id).select(["-password"]);
  if (!user) {
    return res
      .clearCookie("token")
      .status(401)
      .json({ errors: ["Access denied..."] });
  } else {
    return res.status(200).json({ user });
  }
};

// Function to follow a user
exports.followUser = async (req, res, next) => {
  const { followingId } = req.body;
  const { _id } = req.user;

  // Validate user not following himself
  if (followingId === _id) {
    return res
      .status(400)
      .json({ success: false, errors: [`You can't follow yourself.`] });
  }

  // Verify followingId belongs to user in DB
  let user = await User.findById(followingId)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [`Couldn't find user: @${req.params.user_handler}`],
        });
      } else {
        //Verify if user not following already
        let following = Follower.findOne({
          $and: [{ followingId }, { userId: _id }],
        })
          .then((doc) => {
            if (doc) {
              return res.status(400).json({
                success: false,
                errors: ["You already follow that user."],
              });
            } else {
              let follower = Follower({
                userId: _id,
                followingId: followingId,
              }).save(function (err, follower) {
                if (err) return res.status(400).json({ errors: [err] });
                return res.status(200).json({
                  success: true,
                  message: "You Followed the user!",
                  user: followingId,
                });
              });
            }
          })
          .catch((err) => {
            if (err) return res.status(400).json({ errors: [err] });
          });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// Function to unFollow a user
exports.unFollowUser = async (req, res, next) => {
  const { followingId } = req.body;
  const { _id } = req.user;

  // Validate user not unFollowing himself
  if (followingId === _id) {
    return res
      .status(400)
      .json({ success: false, errors: [`You can't unfollow yourself.`] });
  }

  // Validating the use in DB already
  let user = await User.findById(followingId)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [`Couldn't find user: @${req.params.user_handler}`],
        });
      } else {
        // Seraching if the following realtionship in DB or not to delete if exist
        let following = Follower.findOneAndDelete({
          $and: [{ followingId }, { userId: _id }],
        })
          .then((doc) => {
            if (!doc) {
              return res.status(400).json({
                success: false,
                errors: ["You already don't follow that user."],
              });
            } else {
              return res
                .status(200)
                .json({ success: true, message: "You unfollowed that user." });
            }
          })
          .catch((err) => {
            if (err) return res.status(400).json({ errors: [err] });
          });
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

// get Top Followed Users
exports.getTopFollowedUsers = async (req, res, next) => {
  const users = await Follower.find({ userId: req.user._id })
    .then((docs) => {
      if (docs.length !== 0) {
        const users = Follower.aggregate(
          [
            {
              $match: {
                userId: { $eq: req.user._id },
              },
            },
            {
              $group: {
                _id: null,
                followedUsers: { $push: "$followingId" },
              },
            },
            {
              $project: { followedUsers: 1, _id: 0 },
            },

            {
              $lookup: {
                let: { followedUsers: "$followedUsers" },
                from: "followers",
                pipeline: [
                  {
                    $match: {
                      $and: [
                        {
                          $expr: {
                            $not: { $in: ["$followingId", "$$followedUsers"] },
                          },
                        },
                        {
                          $expr: {
                            $ne: ["$followingId", req.user._id],
                          },
                        },
                      ],
                    },
                  },
                ],
                as: "notFollowedUsers",
              },
            },

            { $project: { followedUsers: 0 } },

            { $unwind: "$notFollowedUsers" },
            {
              $group: {
                _id: "$notFollowedUsers.followingId",
                followers: { $sum: 1 },
              },
            },
            { $sort: { followers: -1 } },
            { $limit: 2 },
            {
              $lookup: {
                let: { searchId: { $toObjectId: "$_id" } },
                from: "users",
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
                  {
                    $project: {
                      _id: 1,
                      username: 1,
                      firstName: 1,
                      lastName: 1,
                      photo: 1,
                    },
                  },
                ],
                as: "userData",
              },
            },
            {
              $project: {
                userData: { $arrayElemAt: ["$userData", 0] },
                followers: 1,
                _id: 0,
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    { followersCount: "$followers" },
                    "$userData",
                  ],
                },
              },
            },
          ],
          function (err, users) {
            if (err) return res.status(400).json({ errors: [err] });
            return res.status(200).json({ success: true, users });
          }
        );
      } else {
        const users = Follower.aggregate(
          [
            {
              $match: {
                followingId: { $ne: req.user._id },
              },
            },
            {
              $group: {
                _id: "$followingId",
                followers: {
                  $sum: 1,
                },
              },
            },
            { $sort: { followers: -1 } },
            { $limit: 2 },
            {
              $lookup: {
                let: { searchId: { $toObjectId: "$_id" } },
                from: "users",
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
                  {
                    $project: {
                      _id: 1,
                      username: 1,
                      firstName: 1,
                      lastName: 1,
                      photo: 1,
                    },
                  },
                ],
                as: "userData",
              },
            },
            {
              $project: {
                userData: { $arrayElemAt: ["$userData", 0] },
                followers: 1,
                _id: 0,
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    { followersCount: "$followers" },
                    "$userData",
                  ],
                },
              },
            },
          ],
          function (err, users) {
            if (err) return res.status(400).json({ errors: [err] });
            return res.status(200).json({ success: true, users });
          }
        );
      }
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};

exports.getFollowedUsers = async (req, res, next) => {
  const user = await Follower.aggregate([
    {
      $match: {
        userId: req.user._id,
      },
    },
    {
      $group: {
        _id: null,
        followedUsers: { $push: "$followingId" },
      },
    },
    { $project: { _id: 0 } },

    // { $project: { followingId: 1, _id: 0 } },
  ])
    .then((users) => {
      return res
        .status(200)
        .json({ success: true, users: users[0].followedUsers });
    })
    .catch((err) => {
      if (err) return res.status(400).json({ errors: [err] });
    });
};
