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

// Setting User Auth Routes along with middlewares & controllers
router.post("/auth/register", validateRegisterPayload, registerUser);
router.post("/auth/login", validateLoginPayload, loginUser);
router.get("/auth", validateCookieToken, authUser);
router.get("/auth/logout", logoutUser);

//exporting the router
module.exports = router;
