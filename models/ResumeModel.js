const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    idCandidate: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      //   required: true,
    },
    firstName: {
      type: String,
      //   required: true,
    },
    lastName: {
      type: String,
      //   required: true,
    },
    phone: {
      type: String,
      //   required: true,
    },
    DOB: {
      type: String,
      //   required: true,
    },
    country: {
      type: String,
      //   required: true,
    },
    email: {
      type: String,
      //   required: true,
    },
    city: {
      type: String,
      //   required: true,
    },
    address: {
      type: String,
      //   required: true,
    },
    overview: {
      type: String,
      //   required: true,
    },
    workExperience: {
      type: [],
    },
    skill: {
      type: [],
    },
    education: {
      type: {},
    },
    language: {
      type: [],
    },
    hobbies: {
      type: String,
    },
    avatar: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    tags: {
      type: [],
    },
    resumeFile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("resume", ResumeSchema);
