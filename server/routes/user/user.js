const router = require("express").Router(),
  { getUserProfile } = require("../../controllers/user/userController"),
  { validateCookieToken } = require("../../utils/middlewares");

router.get("/profile", validateCookieToken, getUserProfile);

module.exports = router;
