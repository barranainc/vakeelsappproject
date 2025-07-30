const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with the correct SMTP host
  port: 465, // Port for secure connections
  secure: true, // Use TLS
  auth: {
    user: process.env.SMTP_EMAIL, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

  
  module.exports = transporter;