const Message = require("./models/Message");
const mongoose = require("mongoose");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a thread
    socket.on("join_thread", ({ threadId, userId }) => {
      socket.join(threadId);
      console.log(`User ${userId} joined thread ${threadId}`);
    });

    // Send a message
    socket.on(
      "send_message",
      async ({ threadId, senderId, senderName, text }) => {
        console.log("senderName", senderName);
        try {
          // Validate senderId as a string (if necessary)
          if (typeof senderId !== "string") {
            console.error("Invalid senderId:", senderId);
            return; // Optionally emit an error to the client
          }

          // Create the message with senderId as a string
          const message = await Message.create({
            threadId, // threadId is kept as a string
            senderName: senderName,
            sender: senderId, // senderId is kept as a string
            text,
          });

          io.to(threadId).emit("new_message", message);
        } catch (error) {
          console.error("Error sending message:", error.message);
        }
      }
    );

    // Mark as seen
    socket.on("seen_message", async ({ messageId, userId }) => {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { seenBy: userId } },
        { new: true }
      );
      io.to(message.threadId.toString()).emit("message_seen", message);
    });

    // Delete message
    socket.on("delete_message", async ({ messageId, userId }) => {
      const message = await Message.findById(messageId);
      if (message && message.sender.toString() === userId) {
        await Message.findByIdAndDelete(messageId);
        io.to(message.threadId.toString()).emit("message_deleted", messageId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
