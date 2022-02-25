const Joi = require("joi");

// Joi Login Schema Validation
exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please use a valid email.",
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password is required.",
  }),
});

// Joi Register Schema Validation
exports.registerSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.min": "First Name must be between 3 & 30 characters long.",
    "string.max": "First Name must be between 3 & 30 characters long.",
    "any.required": "First Name is required.",
    "string.empty": "First Name is required.",
    "string.alphanum": "First Name must not include any special characters",
  }),
  lastName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.min": "Last Name must be between 3 & 30 characters long.",
    "string.max": "Last Name must be between 3 & 30 characters long.",
    "any.required": "Last Name is required.",
    "string.empty": "Last Name is required.",
    "string.alphanum": "Last Name must not include any special characters",
  }),
  username: Joi.string().min(5).max(30).required().messages({
    "string.min": "Username must be between 5 & 30 characters long.",
    "string.max": "Username must be between 5 & 30 characters long.",
    "any.required": "Username is required.",
    "string.empty": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please use a valid email.",
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
  }),
  dateOfBirth: Joi.date().required().messages({
    "date.base": "Please enter a valid date",
    "any.required": "Date Of Birth is required.",
    "date.empty": "Date Of Birth is required.",
  }),
  gender: Joi.string().required().valid("male", "female").messages({
    "any.required": "Gender is required.",
    "string.empty": "Gender is required.",
    "any.valid": "Gender must be Male or Female",
    "any.only": "Gender must be Male or Female",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password is required.",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Confirm Password is required.",
    "string.empty": "Confirm Password is required.",
    "any.only": "Passwords doesn't match",
    "any.valid": "Passwords doesn't match",
  }),
});
