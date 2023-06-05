const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    idCompany: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    companyName: {
      type: String,
      default: "",
    },
    position: {
      type: String,
    },
    level: {
      type: String,
      enum: ["Interns", "Fresher", "Experienced", "Senior"],
      default: "Interns",
    },
    jobType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Freelancer",
        "Seasonal",
        "Other",
      ],
      default: "Full-time",
    },
    industry: {
      // nganh nghe cua cong viec
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    requirement: {
      type: String,
    },
    skill: {
      type: Array,
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },
    companySize: {
      type: String,
    },
    infoCompany: {
      type: String,
    },
    logo: {
      type: String,
    },
    experience: {
      type: String,
    },
    images: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    benefit: {
      type: String,
    },
    jobFollower: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

// jobSchema.pre("save", function (next) {
//   if (this.startDate && typeof this.startDate === "string") {
//     this.startDate = new Date(this.startDate);
//   }
//   if (this.endDate && typeof this.endDate === "string") {
//     this.endDate = new Date(this.endDate);
//   }
//   next();
// });

module.exports = mongoose.model("job", jobSchema);
