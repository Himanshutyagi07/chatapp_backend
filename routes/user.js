const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users
router.post("/", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });

  let user = await User.findOne({ username });

  if (!user) {
    user = await User.create({ username });
  }

  res.json({ userId: user._id, username: user.username });
});

module.exports = router;
