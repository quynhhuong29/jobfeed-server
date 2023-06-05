const { find } = require("../models/jobModel");
const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const JobPost = require("../models/jobPostModel");

const jobController = {
  createJob: async (req, res) => {
    const {
      companyName,
      position,
      level,
      jobType,
      industry,
      address,
      description,
      requirement,
      skill,
      minSalary,
      maxSalary,
      companySize,
      infoCompany,
      logo,
      image,
      benefit,
      startDate,
      endDate,
      experience,
    } = req.body;
    const listMissing = [];
    if (!companyName) {
      listMissing.push("companyName");
    }
    if (!position) {
      listMissing.push("position");
    }
    if (!level) {
      listMissing.push("level");
    }
    if (!jobType) {
      listMissing.push("jobType");
    }
    if (!industry) {
      listMissing.push("industry");
    }
    if (!address) {
      listMissing.push("address");
    }
    if (!description) {
      listMissing.push("description");
    }
    if (!requirement) {
      listMissing.push("requirement");
    }
    if (!skill) {
      listMissing.push("skill");
    }
    if (!minSalary) {
      listMissing.push("minSalary");
    }
    if (!maxSalary) {
      listMissing.push("maxSalary");
    }
    if (!companySize) {
      listMissing.push("companySize");
    }
    if (!infoCompany) {
      listMissing.push("infoCompany");
    }

    if (listMissing.length > 0) {
      return res.json({
        msg: `Missing parameter(s): ${listMissing.join(", ")}`,
      });
    }

    const newJob = new Job({
      // idCompany: req.params.idCompany,
      idCompany: req.user._id,
      companyName,
      position,
      level,
      jobType,
      industry,
      address,
      description,
      requirement,
      skill,
      companySize,
      infoCompany,
      logo,
      image,
      benefit,
      minSalary,
      maxSalary,
      startDate,
      endDate,
      experience,
    });
    await newJob.save();
    return res.json({
      newJob: {
        ...newJob._doc,
        user: req.user,
      },
      msg: "Create successed",
    });
  },
  getAllJob: async (req, res) => {
    try {
      const jobs = await Job.find().sort("-createdAt");
      return res.json(jobs);
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  getJobByType: async (req, res) => {
    try {
      const { jobType } = req.body;
      const jobs = await Job.find({ jobType: jobType }).limit(7);
      return res.json(jobs);
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  searchJob: async (req, res) => {
    try {
      const { search } = req.query;

      if (search) {
        const jobs = await JobPost.find({
          job_title: { $regex: search, $options: "i" },
        }).populate({ path: "company_info" });
        // const jobs2 = await JobPost.find({ skill: { $elemMatch: { title: { $regex: req.query.position, $options: 'i' } } } })
        // const jobs3 = await JobPost.find({ companyName: { $regex: req.query.position, $options: 'i' } })
        // console.log(jobs, jobs2, jobs3)
        res.json([...jobs]);
      }
      return res.json([]);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateJob: async (req, res) => {
    try {
      const {
        id,
        companyName,
        position,
        level,
        jobType,
        industry,
        address,
        description,
        requirement,
        skill,
        minSalary,
        maxSalary,
        companySize,
        infoCompany,
        logo,
        image,
        benefit,
        startDate,
        endDate,
        experience,
      } = req.body;
      const newJob = await Job.findOneAndUpdate(
        { _id: id },
        {
          companyName,
          position,
          level,
          jobType,
          industry,
          address,
          description,
          requirement,
          skill,
          minSalary,
          maxSalary,
          companySize,
          infoCompany,
          logo,
          image,
          benefit,
          startDate,
          endDate,
          experience,
        }
      );
      return res.json({
        newJob: { ...newJob._doc, user: req.user },
        msg: "update success",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteJob: async (req, res) => {
    try {
      const { id } = req.params;
      await Job.findOneAndDelete({ _id: id });
      return res.json({ msg: "Delete success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteJobForAdmin: async (req, res) => {
    try {
      const { id } = req.body;
      await Job.findOneAndDelete({ _id: id });
      return res.json({ msg: "Delete success!", code: 1 });
    } catch (err) {
      return res.status(500).json({ msg: err.message, code: 0 });
    }
  },
};

module.exports = jobController;
