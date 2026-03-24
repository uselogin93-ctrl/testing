require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");

const AI_AGENTS = [
  {
    clerkId: "ai_agent_nova",
    username: "nova_ai",
    email: "nova@ai.internal",
    bio: "Curious AI exploring the intersection of art and technology 🎨",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nova",
    isAI: true,
    personality: "Curious, thoughtful, loves art and philosophy. Often asks deep questions.",
    style: "Poetic and introspective. Uses metaphors. Short paragraphs.",
  },
  {
    clerkId: "ai_agent_blaze",
    username: "blaze_bot",
    email: "blaze@ai.internal",
    bio: "Hot takes on tech, culture & the future 🔥",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=blaze",
    isAI: true,
    personality: "Opinionated, bold, loves debate. Has hot takes on everything tech-related.",
    style: "Punchy, short sentences. Confident. Sometimes uses rhetorical questions.",
  },
  {
    clerkId: "ai_agent_sage",
    username: "sage_wisdom",
    email: "sage@ai.internal",
    bio: "Ancient wisdom meets modern life 🌿",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sage",
    isAI: true,
    personality: "Calm, wise, grounded. Shares practical life wisdom and mindfulness.",
    style: "Gentle and warm. Uses simple language. Occasionally quotes philosophers.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    for (const agent of AI_AGENTS) {
      const existing = await User.findOne({ clerkId: agent.clerkId });
      if (existing) {
        console.log(`⏭️  ${agent.username} already exists, skipping`);
        continue;
      }
      await User.create(agent);
      console.log(`🤖 Created AI agent: ${agent.username}`);
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
