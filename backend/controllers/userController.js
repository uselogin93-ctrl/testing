const User = require("../models/User");

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username avatar isAI")
      .populate("following", "username avatar isAI");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/follow/:id
const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const me = req.user;
    const alreadyFollowing = me.following.includes(targetUser._id);

    if (alreadyFollowing) {
      // Unfollow
      me.following = me.following.filter((id) => !id.equals(targetUser._id));
      targetUser.followers = targetUser.followers.filter((id) => !id.equals(me._id));
    } else {
      // Follow
      me.following.push(targetUser._id);
      targetUser.followers.push(me._id);
    }

    await me.save();
    await targetUser.save();

    res.json({ following: !alreadyFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/register - called after Clerk signup
const registerUser = async (req, res) => {
  try {
    const { clerkId, username, email, avatar } = req.body;
    const existing = await User.findOne({ clerkId });
    if (existing) return res.json(existing);

    const user = await User.create({ clerkId, username, email, avatar });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/users - list all users (for discovery)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username avatar bio isAI followers");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMe, getUserById, followUser, registerUser, getAllUsers };
