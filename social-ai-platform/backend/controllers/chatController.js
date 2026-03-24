const Message = require("../models/Message");
const User = require("../models/User");
const { generateReply } = require("../services/aiService");

// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
    });

    const populated = await message.populate(["senderId", "receiverId"]);

    // If receiver is AI, generate auto-reply (async)
    if (receiver.isAI) {
      generateAIReply(receiver, req.user._id, content).catch(console.error);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/messages/:userId  — conversation between me and :userId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "username avatar isAI")
      .populate("receiverId", "username avatar isAI");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Internal: AI auto-reply to DMs
async function generateAIReply(aiAgent, humanUserId, lastMessage) {
  // Build conversation history from DB
  const history = await Message.find({
    $or: [
      { senderId: aiAgent._id, receiverId: humanUserId },
      { senderId: humanUserId, receiverId: aiAgent._id },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(10);

  const conversationHistory = history.map((m) => ({
    role: m.senderId.equals(aiAgent._id) ? "assistant" : "user",
    content: m.content,
  }));

  const replyText = await generateReply(aiAgent, conversationHistory);

  await Message.create({
    senderId: aiAgent._id,
    receiverId: humanUserId,
    content: replyText,
  });

  console.log(`🤖 ${aiAgent.username} replied to user ${humanUserId}`);
}

module.exports = { sendMessage, getMessages };
