const User = require("../../models/user");

// Register User controller function
exports.registerUser = async (req, res, next) => {
  const { email, username } = req.body;
  let user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    return res
      .status(400)
      .json({ errors: ["Email or Username Already Registered."] });
  } else {
    let registeredUser = await User(req.body).save(function (err, user) {
      if (err) return res.status(400).json({ errors: [err] });
      return res
        .status(200)
        .json({ success: true, message: "Registered Successfully." });
    });
  }
};

// Login User Controller Function
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ errors: ["Incorrect Email or Password."] });
  } else {
    user.comparePassword(password, function (err, isMatch) {
      if (err) return res.status(400).json({ errors: [err] });
      if (isMatch) {
        const token = user.generateAuthToken();
        return res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .json({ success: true, message: "You're Logged In." });
      } else {
        return res
          .status(400)
          .json({ errors: ["Incorrect Email or Password. "] });
      }
    });
  }
};

// Check User authorization controller function
exports.authUser = async (req, res, next) => {
  let user = await User.findById(req.user._id, ["-password"]);
  if (!user) {
    return res
      .clearCookie("token")
      .status(401)
      .json({ errors: ["Access denied..."] });
  } else {
    return res.status(200).json({ success: true, user });
  }
};

// Logout User controller function
exports.logoutUser = async (req, res, next) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ sucess: true, message: "LoggedOut" });
};
