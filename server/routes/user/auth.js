const router = require("express").Router(),
  {
    registerUser,
    loginUser,
    authUser,
    logoutUser,
  } = require("../../controllers/user/authController"),
  {
    validateLoginPayload,
    validateRegisterPayload,
    validateCookieToken,
  } = require("../../utils/middlewares");

/**
 * Setting User Auth Routes along with middlewares & controllers
 */

// Register User
router.post("/auth/register", validateRegisterPayload, registerUser);

// Login User & return cookie with JWT token
router.post("/auth/login", validateLoginPayload, loginUser);

// verify user authentication & return user object/info
router.get("/auth", validateCookieToken, authUser);

// Logout User
router.get("/auth/logout", logoutUser);

//exporting the router
module.exports = router;
