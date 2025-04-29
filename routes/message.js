// routes/message.js

const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// GET /api/messages/:threadId
router.get("/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const messages = await Message.find({ threadId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
