const Users = require("../models/userModel");
const Company = require("../models/companyModel");
const Job = require("../models/jobModel");

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
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserAll: async (req, res) => {
    try {
      const users = await Users.find()
        .select("-password")
        .populate("followers following", "-password");
      if (!users) return res.status(400).json({ msg: "User does not exist." });

      res.json({ users });
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
        followers: req.body._id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this user." });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.body._id },
        },
        { new: true }
      ).populate("followers following", "-password");
      await Users.findOneAndUpdate(
        { _id: req.body._id },
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
          $pull: { followers: req.body._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.body._id },
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
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 3;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  followCompany: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followersCompany: req.body.user._id,
      });
      console.log(user);
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this company." });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followersCompany: req.body.user._id },
        },
        { new: true }
      ).populate("followersCompany followCompany", "-password");

      await Users.findOneAndUpdate(
        { _id: req.body.user._id },
        {
          $push: { followCompany: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unFollowCompany: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followersCompany: req.body.user._id },
        },
        { new: true }
      ).populate("followersCompany followCompany", "-password");

      await Users.findOneAndUpdate(
        { _id: req.body.user._id },
        {
          $pull: { followCompany: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  followJob: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.user._id,
        followJob: req.params.id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this job" });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { followJob: req.params.id },
        },
        { new: true }
      );

      await Job.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { jobFollower: req.user._id },
        }
      );

      res.json({ id: req.params.id });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unFollowJob: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { followJob: req.params.id },
        },
        { new: true }
      );

      await Job.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { jobFollower: req.user._id },
        }
      );

      res.json({ id: req.params.id });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUsersRole: async (req, res) => {
    const { _id, role } = req.body.data;
    try {
      const user = await Users.findOneAndUpdate({ _id: _id }, { role: role });
      return res.json({ user, msg: "Update successful" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    const { _id, role } = req.body;

    if (_id !== req.user._id) {
      try {
        const user = await Users.findOneAndDelete({ _id: _id });
        if (role === "company")
          await Company.findOneAndDelete({ idCompany: _id });
        return res.status(200).json({ user, msg: "Delete successful" });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    } else return res.json({ msg: "Don't delete yourself" });
  },
  updateUserAdmin: async (req, res) => {
    try {
      const {
        _id,
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
        { _id: _id },
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
};

module.exports = userController;
