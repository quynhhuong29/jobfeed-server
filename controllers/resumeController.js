const Resume = require("../models/ResumeModel");

const resumeController = {
  createResume: async (req, res) => {
    try {
      const {
        title,
        firstName,
        lastName,
        phone,
        DOB,
        country,
        language,
        email,
        city,
        address,
        overview,
        workExperience,
        skill,
        education,
        hobbies,
        avatar,
        linkedin,
        tags,
      } = req.body;
      const newResume = new Resume({
        title,
        firstName,
        lastName,
        phone,
        DOB,
        country,
        language,
        email,
        city,
        address,
        overview,
        workExperience,
        skill,
        education,
        hobbies,
        avatar,
        idCandidate: req.user._id,
        linkedin,
        tags,
      });
      await newResume.save();
      return res.json({ msg: "Create success" });
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  getListResume: async (req, res) => {
    try {
      const resumes = await Resume.find({ idCandidate: req.user._id });
      return res.json([...resumes]);
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  getResumeById: async (req, res) => {
    try {
      const { id } = req.params;
      const resume = await Resume.findOne({ _id: id });
      return res.json(resume);
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  deleteResumeById: async (req, res) => {
    try {
      const { id } = req.params;
      const resume = await Resume.findOneAndDelete({ _id: id });
      return res.json({ msg: "Delete success" });
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  findResume: async (req, res) => {
    try {
      const { tag, location } = req.body;
      if (location && location !== "All location") {
        const resumes = await Resume.find({
          tags: { $elemMatch: { $regex: tag, $options: "i" } },
          city: { $regex: location, $options: "i" },
        });
        return res.json(resumes);
      }
      const resumes = await Resume.find({
        tags: { $elemMatch: { $regex: tag, $options: "i" } },
      });
      return res.json(resumes);
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  uploadResumeFile: async (req, res) => {
    try {
      const resume = await Resume.findOne({ idCandidate: req.user._id });
      if (!req.body.file) {
        return res.status(400).json({ msg: "No file provided" });
      }

      if (!resume) {
        const newResume = new Resume({
          resumeFile: req.body.file,
          idCandidate: req.user._id,
        });
        await newResume.save();
        return res.json({ msg: "File uploaded successfully" });
      } else {
        resume.resumeFile = req.body.file;
        await resume.save();
        return res.json({ msg: "File uploaded successfully" });
      }
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  getFileResume: async (req, res) => {
    try {
      const resume = await Resume.findOne({ idCandidate: req.user._id });
      return res.status(200).json({ file: resume.resumeFile });
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
};

module.exports = resumeController;
