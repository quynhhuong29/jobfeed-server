const CV = require("../models/cvModel");

const CVController = {
  createCV: async (req, res) => {
    try {
      const {
        avatar,
        firstName,
        lastName,
        email,
        dateOfBirth,
        position,
        phoneNumber,
        address,
        descriptionProfile,
        educations,
        experiences,
        skill,
        language,
      } = req.body;

      if (
        !avatar ||
        !firstName ||
        !lastName ||
        !email ||
        !dateOfBirth ||
        !position ||
        !phoneNumber ||
        !descriptionProfile ||
        !skill ||
        !language
      )
        return res.json({ msg: "Missing parameter!" });

      const newCV = new CV({
        idCandidate: req.user._id,
        firstName,
        lastName,
        email,
        dateOfBirth,
        avatar,
        position,
        phoneNumber,
        address,
        descriptionProfile,
        educations,
        experiences,
        skill,
        language,
      });
      await newCV.save();
      return res.json({
        msg: "Create successed",
      });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  getAllCV: async (req, res) => {
    try {
      const resumes = await CV.find({ idCandidate: req.user._id });

      return res.json(resumes);
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  updateCV: async (req, res) => {
    try {
      const {
        id,
        avatar,
        firstName,
        lastName,
        email,
        dateOfBirth,
        position,
        phoneNumber,
        address,
        descriptionProfile,
        educations,
        experiences,
        skill,
        language,
      } = req.body;

      await CV.findOneAndUpdate(
        { _id: id },
        {
          avatar,
          avatar,
          firstName,
          lastName,
          email,
          dateOfBirth,
          position,
          phoneNumber,
          address,
          descriptionProfile,
          educations,
          experiences,
          skill,
          language,
        }
      );
      return res.json({ msg: "update success" });
    } catch (err) {
      res.json({ msg: err.message });
    }
  },
  deleteCV: async (req, res) => {
    try {
      const { id } = req.body;
      await CV.findOneAndDelete({ _id: id });
      return res.json({ msg: "delete success" });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
};

module.exports = CVController;
