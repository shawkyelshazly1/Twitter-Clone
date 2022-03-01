const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

/**
 * Initializing UserSchema
 * Fields: [firstname: String-required , lastname:String-required]
 */
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    username: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    photo: { type: String },
    password: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

// PreSave adding default photo value based on gender
userSchema.pre("save", function (next) {
  let user = this;

  if (user.gender === "male") {
    this.photo = `https://res.cloudinary.com/dwufx31ox/image/upload/v1646172575/avatar_dh0bj4.png`;
  } else {
    this.photo = `https://res.cloudinary.com/dwufx31ox/image/upload/v1646172610/avatar2_agmtss.png`;
  }
  next();
});

// PreSave hashing the password using bcrypt
userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hashedPassword) {
    if (err) return next(err);
    user.password = hashedPassword;
    next();
  });
});

// Method to return password compare either True or False
userSchema.methods.comparePassword = function (stringPassword, done) {
  bcrypt.compare(stringPassword, this.password, function (err, isMatch) {
    if (err) return done(err);
    return done(null, isMatch);
  });
};

// Method to generate/return auth token using JWT with _id & username in the payload
userSchema.methods.generateAuthToken = function () {
  const payload = { _id: this._id, username: this.username };
  const token = jwt.sign(payload, process.env.JWT_SCERET, { expiresIn: "5h" });
  return token;
};

//Exporting the userSchema
module.exports = mongoose.model("User", userSchema);
