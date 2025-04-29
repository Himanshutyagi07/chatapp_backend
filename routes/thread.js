const express = require("express");
const router = express.Router();
const Thread = require("../models/thread"); // Update the path as needed

// POST /api/threads/join
router.post("/join", async (req, res) => {
  const { threadId } = req.body;

  if (!threadId || threadId.trim() === "") {
    return res.status(400).json({ error: "Thread ID is required." });
  }

  try {
    let thread = await Thread.findOne({ name: threadId });

    if (!thread) {
      thread = await Thread.create({ name: threadId, participants: [] });
    }

    res.status(200).json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
