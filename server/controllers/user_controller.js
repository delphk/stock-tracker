const User = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sgMail = require("../utils/sendgrid");

const registerNewUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const newUser = new User({ name, username, email });
    newUser.setPassword(password);
    await newUser.save();
    res.json({ user: { username: newUser.username, email: newUser.email } });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const userLogin = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.json({ status: "done" });
};

const sendVerificationMail = async (req, res) => {
  const toAddress = req.user.email;

  const token = new Token({
    userId: req.user._id,
    token: crypto.randomBytes(16).toString("hex")
  });
  try {
    await token.save();

    const msg = {
      to: toAddress,
      from: process.env.FROM_ADDRESS,
      subject: "Account Verification Token",
      text:
        "Hello " +
        req.user.name +
        ",\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/users/confirmation/" +
        token.token +
        ".\n"
    };

    sgMail.send(msg, err => {
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
};

const userConfirmation = async (req, res) => {
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
};

const getUserInfo = async (req, res) => {
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
};

const updateUserInfo = async (req, res) => {
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
};

const checkAuthenticated = async (req, res) => {
  if (req.user) {
    res.json({ authenticated: true });
  }
};

module.exports = {
  registerNewUser,
  userLogin,
  deleteUser,
  logout,
  sendVerificationMail,
  userConfirmation,
  getUserInfo,
  updateUserInfo,
  checkAuthenticated
};
