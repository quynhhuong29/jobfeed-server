const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: { type: String, default: "candidate" },
    gender: { type: String, default: "Male" },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
    introduction: { type: String, default: "Something..." },

    website: { type: String, default: "" },
    followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],

    followCompany: [{ type: mongoose.Types.ObjectId, ref: "company" }],
    followJob: [{ type: mongoose.Types.ObjectId, ref: "job" }],
    followersCompany: [{ type: mongoose.Types.ObjectId, ref: "user" }],

    saved: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
