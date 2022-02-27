const router = require("express").Router(),
  {
    getUserProfile,
    followUser,
    unFollowUser,
    getTopFollowedUsers,
    getFollowedUsers,
  } = require("../../controllers/user/userController"),
  { validateCookieToken } = require("../../utils/middlewares");

// Retrieving User profile Info
router.get("/profile", validateCookieToken, getUserProfile);

// Follow Specific user {takes id to follow in payload as "followingId"}
router.post("/:user_handler/follow", validateCookieToken, followUser);

// UnFollow Specific user {takes id to follow in payload as "followingId"}
router.delete("/:user_handler/unfollow", validateCookieToken, unFollowUser);

// Get Highest Followed Users
router.get("/topFollowed", validateCookieToken, getTopFollowedUsers);

// Get Followed Users
router.get("/followedUsers", validateCookieToken, getFollowedUsers);

module.exports = router;
