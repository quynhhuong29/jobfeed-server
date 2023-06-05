const router = require("express").Router();
const auth = require("../middleware/auth");

const jobController = require("../controllers/jobController");

router.post("/job", auth, jobController.createJob);
router.get("/getAllJob", jobController.getAllJob);
router.post("/getJobByType", jobController.getJobByType);
router.get("/searchJob", jobController.searchJob);
router.put("/updateJob", auth, jobController.updateJob);
router.delete("/deleteJob/:id", auth, jobController.deleteJob);
router.post("/delete_company_for_admin", jobController.deleteJobForAdmin);

module.exports = router;
