const router = require("express").Router(),
  {
    getCurrentUserProfile,
    followUser,
    unFollowUser,
    getTopFollowedUsers,
    getFollowedUsers,
    getUserProfile,
  } = require("../../controllers/user/userController"),
  { validateCookieToken } = require("../../utils/middlewares");

// Retrieving current logged in User profile Info
router.get("/profile", validateCookieToken, getCurrentUserProfile);

// Follow Specific user {takes id to follow in payload as "followingId"}
router.post("/:user_handler/follow", validateCookieToken, followUser);

// UnFollow Specific user {takes id to follow in payload as "followingId"}
router.post("/:user_handler/unfollow", validateCookieToken, unFollowUser);

// Get Highest Followed Users
router.get("/topFollowed", validateCookieToken, getTopFollowedUsers);

// Get Followed Users
router.get("/followedUsers", validateCookieToken, getFollowedUsers);

// Get a user profile
router.get("/:user_handler/profile", validateCookieToken, getUserProfile);

module.exports = router;
