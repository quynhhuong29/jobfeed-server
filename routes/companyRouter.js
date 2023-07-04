const router = require("express").Router();
const auth = require("../middleware/auth");
const companyController = require("../controllers/companyController");
const authCompany = require("../middleware/authCompany");
const authAdmin = require("../middleware/authAdmin");

router.get("/getInfoCompany/:id", companyController.getInfoCompany);
router.get("/getTopCompany", companyController.getTopCompany);
// router.get(
//   "/getInfoCompany:id",
//   auth,
//   authCompany,
//   companyController.getInfomationCompany
// );
router.get("/getAllCompany", companyController.getAllCompany);
router.post("/getCompanyByIndustry", companyController.getCompanyByIndustry);
router.patch(
  "/updateInfoCompany",
  auth,
  authCompany,
  companyController.updateInfoCompany
);
router.post("/deleteCompany", auth, authAdmin, companyController.deleteCompany);
router.get("/getInfoCompanyById/:id", companyController.getInfoCompanyById);
router.post("/updateInfoCompany", auth, companyController.updateCompany);

module.exports = router;
