const Company = require("../models/companyModel");
const Users = require("../models/userModel");
const Job = require("../models/jobModel");
const JobPost = require("../models/jobPostModel");

const companyController = {
  getInfoCompany: async (req, res) => {
    try {
      if (!req.params.id)
        return res.status(400).json({ msg: "Id is required" });
      const company = await Company.find({ idCompany: req.params.id });
      return res.status(200).json(company);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllCompany: async (req, res) => {
    try {
      const companies = await Company.find();
      return res.json(companies);
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  getCompanyByIndustry: async (req, res) => {
    try {
      const { industry } = req.body;
      console.log(req);
      const company = await Company.find({ industry: industry });
      return res.json(company);
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  updateInfoCompany: async (req, res) => {
    try {
      const {
        companyName,
        address,
        info,
        companySize,
        logo,
        email,
        website,
        phone,
        taxCode,
        industry,
        city,
      } = req.body;

      if (!companyName)
        return res.status(400).json({ msg: "Company name is required" });

      await Company.findOneAndUpdate(
        { idCompany: req.user.id },
        {
          companyName,
          address,
          info,
          companySize,
          logo,
          email,
          website,
          phone,
          taxCode,
          industry,
          city,
        }
      );

      await Users.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          firstName: companyName,
          lastName: companyName,
          avatar: logo,
          introduction: info,
          website: website,
        }
      );
      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInfomationCompany: async (req, res) => {
    try {
      const { id } = req.params.id;
      const company = await Company.findOne({ companyId: id });
      return res.status(500).json(company);
    } catch (err) {
      return res.status(200).json({ msg: err.message });
    }
  },
  deleteCompany: async (req, res) => {
    const { idCompany } = req.body.data;

    try {
      await Company.findOneAndDelete({ idCompany: idCompany });
      await Users.findOneAndUpdate({ _id: idCompany }, { role: "candidate" });
      await Job.deleteMany({ idCompany: idCompany });
      return res.json({ msg: "Delete successfull" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTopCompany: async (req, res) => {
    // const top = await JobPost.aggregate([{ "$group": { _id: { idCompany: "$idCompany", companyName: '$companyName', logo: '$logo' }, count: { $sum: 1 } } }]).sort('-count').limit(4)
    const top = await JobPost.aggregate([
      { $group: { _id: "$company_info", count: { $sum: 1 } } },
    ])
      .sort("-count")
      .limit(4);
    const data = await Company.find({});
    let newArr = [];
    top.map(function (element) {
      data.map(function (item) {
        if (element._id.toString() === item._id.toString()) {
          newArr.push(item);
        }
      });
    });
    return res.json(newArr);
  },
  getInfoCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findOne({ idCompany: id });
      return res.json(company);
    } catch (error) {
      return res.json({ msg: "Error server" });
    }
  },
};

module.exports = companyController;
