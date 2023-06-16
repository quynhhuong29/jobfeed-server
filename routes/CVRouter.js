const router = require("express").Router();
const auth = require("../middleware/auth");
const CVController = require("../controllers/CVController");

router.post("/createCV", auth, CVController.createCV);
router.get("/getAllCV", auth, CVController.getAllCV);

router.patch("/updateCV", auth, CVController.updateCV);
router.patch("/deleteCV", auth, CVController.deleteCV);
// router.get('/search_job', jobCtrl.searchJob)

module.exports = router;
