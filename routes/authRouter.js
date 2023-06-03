const router = require("express").Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", authController.register);

router.post("/active_email", authController.activeEmail);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh_token", authController.generateAccessToken);

router.post("/reset", auth, authController.resetPassword);
router.post("/company-register", authController.companyRegister);
router.post("/company-login", authController.companyLogin);
router.post("/activation-company", authController.activateEmailCompany);

router.post("/change-password", auth, authController.changePassword);
router.post("/forgot", authController.forgotPassword);

module.exports = router;
