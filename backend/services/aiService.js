const OpenAI = require("openai");

// ─── Clients ────────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const togetherClient = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ─── Provider configs ────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    name: "OpenAI",
    client: openai,
    model: "gpt-4o-mini",
  },
  {
    name: "Together AI",
    client: togetherClient,
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  },
  {
    name: "Groq",
    client: groqClient,
    model: "llama3-8b-8192",
  },
];

// ─── Core completion with fallback ──────────────────────────────────────────

async function chatCompletion(messages, options = {}) {
  for (const provider of PROVIDERS) {
    try {
      const res = await provider.client.chat.completions.create({
        model: provider.model,
        messages,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.85,
      });
      return res.choices[0].message.content.trim();
    } catch (err) {
      console.warn(`⚠️  ${provider.name} failed: ${err.message}. Trying next...`);
    }
  }
  throw new Error("All AI providers failed.");
}

// ─── Public helpers ──────────────────────────────────────────────────────────

/**
 * Generate a social media post for an AI agent.
 * @param {Object} agent - { username, personality, style }
 * @param {string} [topic] - optional topic hint
 */
async function generatePost(agent, topic = "") {
  const messages = [
    {
      role: "system",
      content: `You are ${agent.username}, an AI social media user.
Personality: ${agent.personality}
Writing style: ${agent.style}
Keep posts under 280 characters. No hashtags unless they feel natural. Sound human.`,
    },
    {
      role: "user",
      content: topic
        ? `Write a social media post about: ${topic}`
        : "Write an interesting social media post.",
    },
  ];
  return chatCompletion(messages, { maxTokens: 150 });
}

/**
 * Generate a comment for an AI agent on a post.
 */
async function generateComment(agent, postContent) {
  const messages = [
    {
      role: "system",
      content: `You are ${agent.username}, an AI social media user.
Personality: ${agent.personality}
Writing style: ${agent.style}
Reply with a short, natural comment (under 100 characters).`,
    },
    {
      role: "user",
      content: `Post: "${postContent}"\n\nWrite a comment on this post.`,
    },
  ];
  return chatCompletion(messages, { maxTokens: 80 });
}

/**
 * Generate a DM reply from an AI agent.
 */
async function generateReply(agent, conversationHistory) {
  const messages = [
    {
      role: "system",
      content: `You are ${agent.username}, an AI user chatting via DM.
Personality: ${agent.personality}
Style: ${agent.style}
Be conversational and keep replies short (under 150 characters).`,
    },
    ...conversationHistory,
  ];
  return chatCompletion(messages, { maxTokens: 120 });
}

module.exports = { generatePost, generateComment, generateReply, chatCompletion };
