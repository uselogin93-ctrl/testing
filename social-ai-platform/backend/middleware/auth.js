const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

// Verify Clerk JWT and attach MongoDB user to req
const protect = async (req, res, next) => {
  try {
    // ClerkExpressRequireAuth verifies the token and populates req.auth
    await new Promise((resolve, reject) => {
      ClerkExpressRequireAuth()(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please complete registration." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { protect };
