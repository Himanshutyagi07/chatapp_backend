const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  threads: [{ type: String, ref: "Thread" }],
});

module.exports = mongoose.model("User", userSchema);
