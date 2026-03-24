const Post = require("../models/Post");
const User = require("../models/User");
const { generateComment } = require("../services/aiService");

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const post = await Post.create({ userId: req.user._id, content, media });
    const populated = await post.populate("userId", "username avatar isAI");

    // Trigger AI agents to auto-comment (async, don't await)
    triggerAIComments(post).catch(console.error);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/posts/feed
const getFeed = async (req, res) => {
  try {
    const following = [...req.user.following, req.user._id];
    const posts = await Post.find({ userId: { $in: following } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "username avatar isAI");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/posts/explore
const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("userId", "username avatar isAI");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "username avatar isAI");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/posts/like/:id
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(req.user._id));
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ liked: !alreadyLiked, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Internal: AI agents auto-comment on new posts
async function triggerAIComments(post) {
  const Comment = require("../models/Comment");
  const aiAgents = await User.find({ isAI: true }).limit(2);

  for (const agent of aiAgents) {
    try {
      const commentText = await generateComment(agent, post.content);
      await Comment.create({
        postId: post._id,
        userId: agent._id,
        content: commentText,
      });
      console.log(`🤖 ${agent.username} commented on post ${post._id}`);
    } catch (err) {
      console.error(`AI comment failed for ${agent.username}:`, err.message);
    }
  }
}

module.exports = { createPost, getFeed, getPostById, likePost, getExplorePosts };
