const Users = require("../models/userModel");

const userController = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("firstName lastName username avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {
        avatar,
        firstName,
        lastName,
        mobile,
        address,
        introduction,
        website,
        gender,
      } = req.body;

      if (!firstName || !lastName)
        return res
          .status(400)
          .json({ msg: "Please add your firstName and lastName" });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          firstName,
          lastName,
          mobile,
          address,
          introduction,
          website,
          gender,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.body.user._id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this user." });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.body.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");
      await Users.findOneAndUpdate(
        { _id: req.body.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.body.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.body.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
