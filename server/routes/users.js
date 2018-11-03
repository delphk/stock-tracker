const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

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

module.exports = router;
