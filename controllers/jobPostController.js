const JobPost = require("../models/jobPostModel");
const Company = require("../models/companyModel");
const Industry = require("../models/IndustryModel");

const jobPostController = {
  createJob: async (req, res) => {
    try {
      const {
        job_title,
        job_description,
        job_requirement,
        industry,
        working_location,
        address,
        employment_type,
        expiring_date,
        benefit,
        experience,
        level,
        image,
        logo,
        salary,
        contact_name,
        contact_address,
        contact_email,
        contact_phone,
        company_id,
        idUser,
      } = req.body;
      if (!company_id)
        return res.status(400).json({ msg: "Missing id company" });
      if (!job_title) return res.status(400).json({ msg: "Missing job title" });
      if (!industry) return res.status(400).json({ msg: "Missing industry" });
      if (experience?.isRequired === true) {
        if (!experience?.from || !experience?.to)
          return res.status(400).json({ msg: "Missing experience" });
      }
      const newJob = new JobPost({
        job_title,
        job_description,
        job_requirement,
        industry,
        working_location,
        address,
        employment_type,
        expiring_date,
        benefit,
        working_experience: experience,
        level,
        image,
        logo,
        salary,
        contact_name,
        contact_address,
        contact_email,
        contact_phone,
        company_info: company_id,
        idUser,
      });

      await newJob.save();

      return res.json({ msg: "Create success." });
    } catch (error) {
      return res.status(500).json({ msg: error.msg });
    }
  },
  getAllJob: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const currentDate = new Date().toISOString();
      if (page && limit) {
        let skip = (page - 1) * limit;
        const totalJob = await JobPost.find({
          expiring_date: { $gt: currentDate },
        });
        const jobs = await JobPost.find({ expiring_date: { $gt: currentDate } })
          .populate(
            "company_info",
            "_id companyName logo address working_location"
          )
          .sort("-createdAt")
          .limit(Number(limit))
          .skip(skip);

        return res.json({ jobs, total: totalJob.length });
      } else {
        const jobs = await JobPost.find({
          expiring_date: { $gt: currentDate },
        }).populate(
          "company_info",
          "_id companyName logo address working_location"
        );
        return res.json({ jobs, total: jobs.length });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.msg });
    }
  },
  getJobsByCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findOne({ idCompany: id });

      const jobs = await JobPost.find({ company_info: company._id })
        .populate("industry", "title description")
        .populate("company_info", "_id companyName logo address")
        .sort("-createdAt");
      return res.json(jobs);
    } catch (error) {
      return res.json(error.msg);
    }
  },
  deleteJob: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ msg: "Missing id" });

      await JobPost.findOneAndDelete({ _id: id });
      return res.json({ msg: "Delete success!" });
    } catch (error) {
      return res.status(500).json(error.msg);
    }
  },
  getJobById: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await JobPost.findOne({ _id: id })
        .populate("industry", "title description")
        .populate(
          "company_info",
          "_id companyName logo address idCompany website phone email"
        );
      return res.json(job);
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  updateJobPost: async (req, res) => {
    if (!req.body.id) return res.status(400).json({ msg: "Missing id" });
    try {
      const {
        id,
        benefit,
        job_description,
        job_requirement,
        job_title,
        expiring_date,
        contact_name,
        contact_phone,
        contact_address,
        contact_email,
        experience,
        industry,
        working_location,
        address,
        employment_type,
        level,
        salary,
      } = req.body;
      await JobPost.findOneAndUpdate(
        { _id: id },
        {
          benefit,
          job_description,
          job_requirement,
          job_title,
          expiring_date,
          contact_name,
          contact_phone,
          contact_address,
          contact_email,
          experience,
          industry,
          working_location,
          address,
          employment_type,
          level,
          salary,
        }
      );
      return res.status(200).json({ msg: "Update success!" });
    } catch (error) {
      return res.json({ msg: error.msg });
    }
  },
  searchJob: async (req, res) => {
    try {
      const { search, workingLocation, industry } = req.query;

      let jobs = [];

      const conditions = {};

      if (search) {
        const searchRegex = new RegExp(search, "i");
        conditions.$or = [
          { job_title: searchRegex },
          { companyName: searchRegex },
        ];
      }

      if (workingLocation) {
        const locationRegex = new RegExp(workingLocation, "i");
        conditions.working_location = locationRegex;
      }

      if (industry) {
        conditions.industry = industry;
      }

      if (Object.keys(conditions).length === 0) {
        jobs = await JobPost.find()
          .populate({ path: "company_info" })
          .sort("-createdAt");
      } else {
        jobs = await JobPost.find(conditions)
          .populate({ path: "company_info" })
          .sort("-createdAt");
      }

      if (jobs.length > 0) {
        return res.json(jobs);
      } else {
        return res.json({ msg: "Not exist" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getJobSaved: async (req, res) => {
    try {
      const { saved } = req.body;
      console.log(saved);
      const jobs = await JobPost.find({}).populate("company_info");
      const newArr = [];
      jobs.map((element) => {
        if (saved.includes(element._id.toString())) newArr.push(element);
      });
      return res.json(newArr);
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDataChartPie: async (req, res) => {
    try {
      const { id } = req.params;

      const jobs = await JobPost.find({ company_info: id });
      let partTime = 0,
        fulltime = 0,
        internship = 0,
        fresher = 0;
      jobs.map((element) => {
        switch (element.employment_type) {
          case "Full-time":
            fulltime++;
            break;
          case "Part-time":
            partTime++;
            break;
          case "Internship":
            internship++;
            break;
          case "Fresher":
            fresher++;
            break;
          default:
            break;
        }
      });
      return res.json([
        { type: "Part-time", value: partTime },
        { type: "Internship", value: internship },
        { type: "Full-time", value: fulltime },
        { type: "Fresher", value: fresher },
      ]);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getJobsLatest: async (req, res) => {
    try {
      const latestJobPosts = await JobPost.find()
        .populate(
          "company_info",
          "_id companyName logo address working_location"
        )
        .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo giảm dần
        .limit(4);

      res.json(latestJobPosts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách jobPost mới nhất:", error);
      res.status(500).json({ message: error.message });
    }
  },
  countByEmploymentType: async (req, res) => {
    try {
      const jobCounts = await JobPost.aggregate([
        {
          $group: {
            _id: "$employment_type",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {};
      jobCounts.forEach((item) => {
        result[item._id] = item.count;
      });

      res.json(result);
    } catch (error) {
      console.error(
        "Lỗi khi đếm số lượng job của từng employment_type:",
        error
      );
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  },
  countJobsByIndustry: async (req, res) => {
    try {
      const industryCounts = await JobPost.aggregate([
        {
          $group: {
            _id: "$industry",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

      const result = await Industry.populate(industryCounts, { path: "_id" });
      const transformedResult = result.map((item) => ({
        industry_info: item._id,
        count: item.count,
      }));
      res.json(transformedResult);
    } catch (error) {
      console.error("Lỗi khi đếm số lượng công việc theo ngành:", error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  },
};

module.exports = jobPostController;
