const router = require("express").Router();

const jobController = require("../controllers/jobController");

router.post("/create_job", jobController.createJob);
router.post("/get_all_job", jobController.getAllJob);
router.post("/get_job_by_type", jobController.getJobByType);
router.get("/search_job", jobController.searchJob);
router.post("/update_job", jobController.updateJob);
router.post("/delete_job", jobController.deleteJob);
router.post("/delete_company_for_admin", jobController.deleteJobForAdmin);

module.exports = router;
