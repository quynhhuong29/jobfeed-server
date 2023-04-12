const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, SENDER_MAIL } =
  process.env;

const authController = {
  register: async (req, res) => {
    try {
      const { fullName, username, email, password, gender } = req.body;
      let newUsername = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUsername });
      if (user_name)
        return res.status(400).json({ msg: "This username already exist. " });

      const user_email = await Users.findOne({ email });
      if (user_email)
        return res.status(400).json({ msg: "This email already exist. " });

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullName,
        username: newUsername,
        email,
        password: passwordHash,
        gender,
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // await newUser.save();

      sendMail();
      res.json({
        msg: "Register Successful!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL, // email sender
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: SENDER_MAIL,
      to: "quynhhuongks2901@gmail.com",
      subject: "Jobs Feed Activate Account",
      html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the JobLibrary.</h2>
              <p>Congratulations! You're almost set to start using JobLibrary.
                  Just click the button below to validate your email address.
              </p>
              
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              </div>
          `,
    };

    let info = await transport.sendMail(mailOptions);

    console.log(info);
  } catch (err) {
    console.error(err);
  }
};

module.exports = authController;
