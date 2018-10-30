const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    require: true,
    index: true
  },
  salt: String,
  hash: String,
  email: { type: String, lowercase: true, unique: true, require: true },
  name: String
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

const User = mongoose.model("User", userSchema);

module.exports = User;
