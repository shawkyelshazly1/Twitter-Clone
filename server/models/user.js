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
    this.photo = `https://mir-s3-cdn-cf.behance.net/project_modules/disp/1bdc9a33850498.56ba69ac2ba5b.png`;
  } else {
    this.photo = `https://i.pinimg.com/originals/10/12/c0/1012c06c7e1b0f8f5e60611992785e5a.png`;
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
