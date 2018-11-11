const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

let auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

let nodemailerMailgun = nodemailer.createTransport(mailgunTransport(auth));

module.exports = nodemailerMailgun;
