const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");

const User = require("../models/user");

// Handle user registration
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  const newUser = new User({ name, username, email });
  newUser.setPassword(password);
  await newUser.save();
  res.json({ user: { username: newUser.username, email: newUser.email } });
});

// Handle user login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !user.verifyPassword(req.body.password)) {
    return res
      .status(403)
      .json({ error: { message: "username and/or password is invalid" } });
  }
  const token = user.generateToken();

  res.cookie("jwt", token, { httpOnly: true, sameSite: true });
  return res.json({
    user: { username: user.username, email: user.email }
  });
});

// // Handle user change password RESET PASSWORD?
// router.put('/change_password',  passport.authenticate("jwt", { session: false }), (req, res)= {

// })

// Handle user delete account
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json({ status: "deleted" });
});

// Handle user logout
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.clearCookie("jwt");
    res.json({ status: "done" });
  }
);

module.exports = router;
