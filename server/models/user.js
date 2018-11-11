const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const { isEmail } = require("validator");

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "is required"]
  },
  salt: String,
  hash: String,
  isVerified: { type: Boolean, default: false },
  emailAlert: { type: Boolean, default: false },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "is required"],
    validate: [isEmail, "invalid email"]
  },
  name: { type: String, required: [true, "is required"] }
});

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = hashPassword(password, this.salt);
};

userSchema.methods.verifyPassword = function(password) {
  return hashPassword(password, this.salt) === this.hash;
};

userSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      userid: this._id,
      username: this.username
    },
    secret,
    { expiresIn: "60 days" }
  );
};

userSchema.methods.verifyToken = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

userSchema.plugin(uniqueValidator, { message: "has been taken" });
const User = mongoose.model("User", userSchema);

module.exports = User;
