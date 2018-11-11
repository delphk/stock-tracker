const express = require("express");
const router = express.Router();
const passport = require("passport");
const crypto = require("crypto");

const nodemailerMailgun = require("../utils/email_service");
const User = require("../models/user");
const Token = require("../models/token");

// Handle user registration
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const newUser = new User({ name, username, email });
    newUser.setPassword(password);
    await newUser.save();
    res.json({ user: { username: newUser.username, email: newUser.email } });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Handle user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !user.verifyPassword(req.body.password)) {
      return res
        .status(403)
        .json({ error: { message: "Username and/or password is invalid" } });
    }
    const token = user.generateToken();

    res.cookie("jwt", token, { httpOnly: true, sameSite: true });
    return res.json({
      user: { username: user.username, email: user.email }
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Handle user delete account
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.json({ status: "deleted" });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

// Handle user logout
router.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.json({ status: "done" });
});

//Handle user email verification
router.post(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const toAddress = req.user.email;

    const token = new Token({
      userId: req.user._id,
      token: crypto.randomBytes(16).toString("hex")
    });
    try {
      await token.save();
      const mailOptions = {
        from: process.env.FROM_ADDRESS,
        to: toAddress,
        subject: "Account Verification Token",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/users/confirmation/" +
          token.token +
          ".\n"
      };
      nodemailerMailgun.sendMail(mailOptions, err => {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).json({
          msg: "A verification email has been sent to " + req.user.email + "."
        });
      });
    } catch (err) {
      return res.status(500).send({ msg: err.message });
    }
  }
);

// Handles confirmation after user verifies email
router.get("/confirmation/:token", async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find a valid token. Your token may have expired."
      });
    const user = await User.findOne({
      _id: token.userId
    });
    if (!user)
      return res
        .status(400)
        .send({ msg: "We were unable to find a user for this token." });
    user.isVerified = true;
    await user.save();
    res.status(200).send("Your account has been verified. Please log in.");
  } catch (err) {
    console.log(err);
  }
});

// Gets a user information
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.json({
        name: user.name,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        emailAlert: user.emailAlert
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

//Update user information
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true
      });
      res.json({
        name: user.name,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        emailAlert: user.emailAlert
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

module.exports = router;
