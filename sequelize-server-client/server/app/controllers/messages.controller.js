// server/app/controllers/messages.controller.js
const apiMessages = [];

function initializeWebSocket(io, handleWebSocketMessages) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("message", "Welcome to the WebSocket server!");

    socket.on("clientMessage", (data) => {
      handleWebSocketMessages(io, socket, data, apiMessages);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

function handleWebSocketMessages(io, socket, data, apiMessages) {
  console.log("Received message from client:", data);

  io.emit("serverMessage", "Server received your message: " + data);

  apiMessages.push(data);

  io.emit("apiMessage", { messages: apiMessages });
}

function getMessages(req, res) {
  res.json({ messages: apiMessages });
}

function postMessage(req, res) {
  const message = req.body.message;

  io.emit("serverMessage", message);

  res.json({ success: true, message: "Message sent to WebSocket" });
}

module.exports = { initializeWebSocket, handleWebSocketMessages, getMessages, postMessage };
