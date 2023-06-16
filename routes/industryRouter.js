const router = require("express").Router();
const industryController = require("../controllers/industryController");

router.post("/createIndustry", industryController.createIndustry);
router.get("/getIndustry", industryController.getIndustry);

module.exports = router;
