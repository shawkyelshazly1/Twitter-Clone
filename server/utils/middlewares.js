const { loginSchema, registerSchema, tweetSchema } = require("./joiSchema"),
  jwt = require("jsonwebtoken");

// Validate Login payload against Joi Login Schema
exports.validateLoginPayload = async function (req, res, next) {
  try {
    const ValidatedData = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const messages = [];
    error.details.forEach((err) => {
      messages.push(err.message);
    });
    return res.status(400).json({ errors: messages });
  }
};

// Validate Register payload against Joi Register Schema
exports.validateRegisterPayload = async function (req, res, next) {
  try {
    const ValidatedData = await registerSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const messages = [];
    error.details.forEach((err) => {
      messages.push(err.message);
    });
    return res.status(400).json({ errors: messages });
  }
};

// Validate Tweet payload against Joi Tweet Schema
exports.validateTweetPayload = async function (req, res, next) {
  try {
    const ValidatedData = await tweetSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const messages = [];
    error.details.forEach((err) => {
      messages.push(err.message);
    });
    return res.status(400).json({ errors: messages });
  }
};

// Validate token middleware with each request
exports.validateCookieToken = async function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ errors: ["Access denied..."] });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SCERET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ errors: ["Access denied..."] });
  }
};
