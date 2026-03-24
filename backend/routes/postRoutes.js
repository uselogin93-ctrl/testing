const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPost,
  getFeed,
  getPostById,
  likePost,
  getExplorePosts,
} = require("../controllers/postController");

router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.get("/explore", protect, getExplorePosts);
router.get("/:id", protect, getPostById);
router.post("/like/:id", protect, likePost);

module.exports = router;
