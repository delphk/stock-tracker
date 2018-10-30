const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Handle user registration
router.post("/register", async (req, res, next) => {
  try {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email
    });
    newUser.setPassword(req.body.password);
    await newUser.save();
    res.json({ user: { username: newUser.username, email: newUser.email } });
  } catch (err) {
    next(err);
  }
});

// Handle user login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.verifyPassword(req.body.password)) {
    return res
      .status(403)
      .json({ error: { message: "email or password is invalid" } });
  } else {
    return res.json({ error: { message: "authorized" } });
  }
});

// // Handle user change password RESET PASSWORD?
// router.put('/change_password', (req, res)= {

// })

// // Handle user logout
// router.post('/logout', (req, res)=> {

// })

// // Get user login page
// router.get('/login', (req, res)=> {

// })

// // Get user registration page
// router.get('/register', (req, res)=> {

// })

// // Get user change password page
// router.get('/change_password', (req, res)=> {

// })

module.exports = router;
