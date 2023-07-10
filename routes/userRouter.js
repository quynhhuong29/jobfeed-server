const router = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const userController = require("../controllers/userController");

// /search?username
router.get("/search", userController.searchUser);
router.get("/user/:id", auth, userController.getUser);
router.patch("/user", auth, userController.updateUser);
router.patch(
  "/updateUserInfo",
  auth,
  authAdmin,
  userController.updateUserAdmin
);

// Get all users
router.get("/users", auth, authAdmin, userController.getUserAll);
// Update role of user
router.patch("/update_role", auth, authAdmin, userController.updateUsersRole);
// Delete User
router.post("/delete", auth, authAdmin, userController.deleteUser);

// follow user
router.patch("/user/:id/follow", auth, userController.follow);
// unFollow user
router.patch("/user/:id/unFollow", auth, userController.unfollow);

// follow company
router.patch("/user/:id/followCompany", auth, userController.followCompany);
// unFollow company
router.patch("/user/:id/unFollowCompany", auth, userController.unFollowCompany);

// follow job
router.patch("/user/:id/followJob", auth, userController.followJob);
// unFollow job
router.patch("/user/:id/unFollowJob", auth, userController.unFollowJob);

router.get("/suggestionsUser", auth, userController.suggestionsUser);

module.exports = router;
