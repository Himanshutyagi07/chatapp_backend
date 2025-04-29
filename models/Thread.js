const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  name: String,
  participants: [{ type: String, ref: "User" }],
});

module.exports = mongoose.model("Thread", threadSchema);
