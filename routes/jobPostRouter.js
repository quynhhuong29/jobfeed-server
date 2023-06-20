const router = require("express").Router();
const jobPostController = require("../controllers/jobPostController");
const auth = require("../middleware/auth");

router.post("/createJob", jobPostController.createJob);
router.get("/getAllJob", jobPostController.getAllJob);
router.get("/getJob/:id", jobPostController.getJobById);
router.delete("/deleteJob/:id", jobPostController.deleteJob);
router.get("/getJobsByCompany/:id", jobPostController.getJobsByCompany);
router.post("/updateJobPost", auth, jobPostController.updateJobPost);
router.get("/searchJobPost", jobPostController.searchJob);
router.post("/getJobSaved", jobPostController.getJobSaved);
router.get("/dataChartJobType/:id", jobPostController.getDataChartPie);

module.exports = router;
