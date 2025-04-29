// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user");
const threadRoutes = require("./routes/thread");
const messageRoutes = require("./routes/message");

const app = express();
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => res.send("API Running"));

// Socket.io logic
require("./socket")(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
