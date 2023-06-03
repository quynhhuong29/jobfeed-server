const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../helpers/emailHelper");
require("dotenv").config();

const { CLIENT_URL, ACTIVE_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const authController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, role } = req.body;
      let newUsername = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUsername });
      if (user_name)
        return res
          .status(400)
          .json({ message: "This username already exist. " });

      const user_email = await Users.findOne({ email });
      if (user_email) {
        return res.status(400).json({ message: "This email already exist. " });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        firstName,
        lastName,
        username: newUsername,
        email,
        password: passwordHash,
        role,
      });

      const verifyToken = createActiveToken({ ...newUser._doc });
      const url = `${CLIENT_URL}/verify?verifiedToken=${verifyToken}`;
      sendMail(email, url, newUsername);
      res.json({
        message:
          "Register Successful! Please check your email to activate your account.",
        // access_token,
        // user: {
        //   ...newUser._doc,
        //   password: "",
        // },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  activeEmail: async (req, res) => {
    try {
      const { verifiedToken } = req.body;
      console.log(
        "🚀 ~ file: authController.js:71 ~ activeEmail: ~ verifiedToken:",
        verifiedToken
      );

      const user = jwt.verify(verifiedToken, ACTIVE_TOKEN_SECRET);

      const { firstName, lastName, username, email, password, role } = user;

      const isExistUsername = await Users.findOne({ username });
      if (isExistUsername) {
        return res
          .status(400)
          .json({ message: "This username already exist. " });
      }

      const isExistEmail = await Users.findOne({ email });
      if (isExistEmail) {
        return res.status(400).json({ message: "This email already exist. " });
      }

      const newUser = new Users({
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      });

      await newUser.save();
      res.json({ message: "Active Successful!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).populate(
        "followers following",
        "-password"
      );

      if (!user) return res.status(400).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Password is incorrect." });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ message: "Logout Successful!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ message: "Please login" });

      jwt.verify(rf_token, REFRESH_TOKEN_SECRET, async (err, result) => {
        if (err) return res.status(400).json({ message: "Please login" });

        const user = await Users.findById(result.id)
          .select("-password")
          .populate("followers following", "-password");

        if (!user) return res.status(400).json({ message: "User not found" });

        const access_token = createAccessToken({ id: result.id });

        res.json({ access_token, user });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/reset/${access_token}`;

      sendMail(email, url, user);
      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  companyRegister: async (req, res) => {
    try {
      const {
        email,
        password,
        companyName,
        size,
        city,
        address,
        info,
        contactName,
        phone,
      } = req.body;
      let user_name = companyName.toLowerCase().replace(/ /g, "");
      const company_email = await Users.findOne({ email: email });

      //check email
      if (company_email) return res.json({ msg: "This email already exists." });
      //check password
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        email,
        username: user_name,
        companyName,
        role: "company",
        size,
        city,
        address,
        info,
        contactName,
        phone,
        password: passwordHash,
        firstName: "",
        lastName: companyName,
      });
      const newCompany = new Company({
        companyName,
        role: "company",
        size,
        city,
        address,
        info,
        contactName,
        phone,
      });

      const activation_token = createActiveToken({
        ...newCompany._doc,
        ...newUser._doc,
      });
      const url = `${CLIENT_URL}/verify?verifiedToken=${verifyToken}`;
      sendMail(email, url, newUser);
      res.json({
        msg: "Register Success! Please activate your email to start.",
      });
    } catch (error) {
      return res.json(error.message);
    }
  },
  companyLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const users = await Users.findOne({ email }).populate(
        "followers following",
        "avatar username firstName lastName followers following"
      );

      if (!users)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, users.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      const company = await Company.findOne({ idCompany: users._id });

      const access_token = createAccessToken({ id: users._id });
      const refresh_token = createRefreshToken({ id: users._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Login Success!",
        access_token,
        user: {
          ...users._doc,
          company: { ...company._doc },
          password: "",
        },
      });
    } catch (error) {
      return res.json(res.json(error.message));
    }
  },
  activateEmailCompany: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const {
        firstName,
        lastName,
        email,
        username,
        role,
        password,
        companyName,
        size,
        city,
        address,
        info,
        contactName,
        phone,
      } = user;
      const check = await Users.findOne({ email });
      if (check)
        return res.status(400).json({ msg: "This email already exists." });

      const newUser = new Users({
        firstName,
        lastName,
        username: username,
        role,
        email,
        password,
      });
      await newUser.save();
      const newCompany = new Company({
        idCompany: newUser._id,
        companyName,
        size,
        city,
        address,
        info,
        contactName,
        phone,
      });
      await newCompany.save();

      res.json({ msg: "Account has been activated!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { current_password, new_password, cf_password } = req.body;
      const userId = req.user._id;

      if (new_password !== cf_password)
        return res.json({ error: "Confirm password not match!" });

      const user = await Users.findOne({ _id: userId });

      if (!user) return res.json({ error: "Not exitst user!" });

      const isMatch = await bcrypt.compare(current_password, user.password);

      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      const passwordHash = await bcrypt.hash(new_password, 12);
      await Users.findOneAndUpdate({ _id: userId }, { password: passwordHash });

      return res.json({ success: "Change success" });
    } catch (error) {
      return res.json({ msg: "Change fail!" });
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
