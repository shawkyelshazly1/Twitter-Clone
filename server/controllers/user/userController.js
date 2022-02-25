const User = require("../../models/user");

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
