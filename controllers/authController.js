const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../helpers/emailHelper");
require("dotenv").config();

const { CLIENT_URL, ACTIVE_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const authController = {
  register: async (req, res) => {
    try {
      const { fullName, username, email, password, role } = req.body;
      let newUsername = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUsername });
      if (user_name)
        return res.status(400).json({ msg: "This username already exist. " });

      const user_email = await Users.findOne({ email });
      if (user_email) {
        return res.status(400).json({ msg: "This email already exist. " });
      }

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
        role,
      });

      // const access_token = createAccessToken({ id: newUser._id });
      // const refresh_token = createRefreshToken({ id: newUser._id });

      // res.cookie("refreshtoken", refresh_token, {
      //   httpOnly: true,
      //   path: "/api/refresh_token",
      //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      // });
      // await newUser.save();

      const verifyToken = createActiveToken({ ...newUser._doc });
      const url = `${CLIENT_URL}/verify?verifiedToken=${verifyToken}`;
      sendMail(email, url, newUsername);
      res.json({
        msg: "Register Successful! Please check your email to activate your account.",
        // access_token,
        // user: {
        //   ...newUser._doc,
        //   password: "",
        // },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activeEmail: async (req, res) => {
    try {
      const { verifiedToken } = req.body;

      console.log(verifiedToken);
      const user = jwt.verify(verifiedToken, ACTIVE_TOKEN_SECRET);

      const { fullName, username, email, password, role } = user;

      const isExistUsername = await Users.findOne({ username });
      if (isExistUsername) {
        return res.status(400).json({ msg: "This username already exist. " });
      }

      const isExistEmail = await Users.findOne({ email });
      if (isExistEmail) {
        return res.status(400).json({ msg: "This email already exist. " });
      }

      const newUser = new Users({
        fullName,
        username,
        email,
        password,
        role,
      });
      await newUser.save();

      res.json({ msg: "Active Successful!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).populate(
        "followers following",
        "-password"
      );

      if (!user) return res.status(400).json({ msg: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        msg: "Login Success!",
        access_token,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logout Successful!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login" });

      jwt.verify(rf_token, REFRESH_TOKEN_SECRET, async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login" });

        const user = await Users.findById(result.id)
          .select("-password")
          .populate("followers following", "-password");

        if (!user) return res.status(400).json({ msg: "User not found" });

        const access_token = createAccessToken({ id: result.id });

        res.json({ access_token, user });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createActiveToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVE_TOKEN_SECRET, {
    expiresIn: "1d",
  });
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

module.exports = authController;
