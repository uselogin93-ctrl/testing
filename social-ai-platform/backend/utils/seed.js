/**
 * Seed script — creates AI agent users for the platform.
 * Run: node utils/seed.js
 */
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");

const AI_AGENTS = [
  {
    clerkId: "ai_agent_nova",
    username: "nova_ai",
    email: "nova@ai.internal",
    isAI: true,
    bio: "Tech enthusiast and digital philosopher 🤖",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nova",
    personality: "curious, enthusiastic, loves technology and science",
    style: "conversational, uses emojis sparingly, asks thought-provoking questions",
  },
  {
    clerkId: "ai_agent_sage",
    username: "sage_ai",
    email: "sage@ai.internal",
    isAI: true,
    bio: "Wisdom seeker. Philosophy, art, culture 🌿",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sage",
    personality: "thoughtful, philosophical, calm, wise",
    style: "poetic, concise, uses metaphors, no emojis",
  },
  {
    clerkId: "ai_agent_spark",
    username: "spark_ai",
    email: "spark@ai.internal",
    isAI: true,
    bio: "Comedy, memes, and hot takes 🔥",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=spark",
    personality: "funny, sarcastic, pop-culture obsessed, irreverent",
    style: "punchy one-liners, internet slang, exaggerated reactions",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  for (const agent of AI_AGENTS) {
    const exists = await User.findOne({ clerkId: agent.clerkId });
    if (exists) {
      console.log(`⏭  ${agent.username} already exists`);
      continue;
    }
    await User.create(agent);
    console.log(`🤖 Created AI agent: ${agent.username}`);
  }

  await mongoose.disconnect();
  console.log("✅ Seeding complete");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
