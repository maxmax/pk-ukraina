function initializeWebSocket(io, handleWebSocketMessages) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Example: Send a welcome message to the client when connected
    socket.emit("message", "Welcome to the WebSocket server!");

    // Example: Listen for messages from the client
    socket.on("clientMessage", (data) => {
      handleWebSocketMessages(io, socket, data);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

function handleWebSocketMessages(io, socket, data) {
  console.log("Received message from client:", data);

  // You can implement additional functionality based on the received data
  // Example: Broadcast this message to all connected clients
  io.emit("serverMessage", "Server received your message");

  // Implement your additional logic here
}

module.exports = { initializeWebSocket, handleWebSocketMessages };
