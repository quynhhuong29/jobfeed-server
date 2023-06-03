const router = require("express").Router();
const auth = require("../middleware/auth");
const postController = require("../controllers/postController");

router
  .route("/posts")
  .post(auth, postController.createPost)
  .get(auth, postController.getPosts);

module.exports = router;
