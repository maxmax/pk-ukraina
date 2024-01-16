const socketIo = require("socket.io");

let ioInstance; // Variable to hold the Socket.IO instance

function initializeWebSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CORS_OPTIONS || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io; // Store the Socket.IO instance

  io.on("connection", (socket) => {
    console.log("Client connected");

    // Handle messages from clients (if needed)
    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);
      // Additional processing if needed
    });

    // Send a welcome message to the connected client
    socket.emit("message", "Connected to server");

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

function getIoInstance() {
  return ioInstance;
}

module.exports = { initializeWebSocket, getIoInstance };
