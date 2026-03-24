const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { sendMessage, getMessages } = require("../controllers/chatController");

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);

module.exports = router;
