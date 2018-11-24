const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  registerNewUser,
  userLogin,
  deleteUser,
  logout,
  sendVerificationMail,
  userConfirmation,
  getUserInfo,
  updateUserInfo
} = require("../controllers/user_controller");

// Handle user registration
router.post("/register", registerNewUser);

// Handle user login
router.post("/login", userLogin);

// Handle user delete account
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

// Handle user logout
router.post("/logout", logout);

//Handle user email verification
router.post(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  sendVerificationMail
);

// Handles confirmation after user verifies email
router.get("/confirmation/:token", userConfirmation);

// Gets a user information
router.get("/", passport.authenticate("jwt", { session: false }), getUserInfo);

//Update user information
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  updateUserInfo
);

module.exports = router;
