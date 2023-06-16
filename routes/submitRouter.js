const router = require("express").Router();
const auth = require("../middleware/auth");
const authCompany = require("../middleware/authCompany");
const submitController = require("../controllers/submitController");

router.post("/submitCV", auth, submitController.submit);
router.get("/getSubmitted", auth, submitController.getSubmitted);
router.post("/unSubmitCV", auth, submitController.unSubmit);
router.post("/setStatus", submitController.setStatus);
router.get("/getSubmittedForCompany/:id", submitController.getResumeByIdJob);
router.post("/deleteSubmit", auth, authCompany, submitController.deleteSubmit);
router.post("/deleteCV", auth, authCompany, submitController.deleteCV);
router.get("/getStatusCard/:id", submitController.dataStatus);
router.get(
  "/getResumeSubmittedByMonth/:id",
  submitController.dataChartCVSubmittedByMonth
);

module.exports = router;
