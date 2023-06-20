const router = require("express").Router();
const resumeController = require("../controllers/resumeController");
const auth = require("../middleware/auth");

router.post("/createResume", auth, resumeController.createResume);
router.get("/getListResume", auth, resumeController.getListResume);
router.get("/getResumeById/:id", auth, resumeController.getResumeById);
router.delete("/deleteResumeById/:id", auth, resumeController.deleteResumeById);
router.post("/findResume", resumeController.findResume);
router.post("/updateResume", auth, resumeController.uploadResumeFile);
router.get("/getFileResume", auth, resumeController.getFileResume);

module.exports = router;
