const Comment = require("../models/Comment");
const Post = require("../models/Post");

// POST /api/comments/:postId
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.user._id,
      content: req.body.content,
    });

    const populated = await comment.populate("userId", "username avatar isAI");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/comments/:postId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .populate("userId", "username avatar isAI");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addComment, getComments };
