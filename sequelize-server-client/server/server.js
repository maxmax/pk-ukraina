const express = require("express");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_OPTIONS || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

var corsOptions = {
  origin: process.env.CORS_OPTIONS || "http://localhost:5173"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to pk-ukraina application." });
});

require("./app/routes/statement.routes")(app);
require("./app/routes/fake.routes")(app);

// Importing a module for working with WebSocket
const { initializeWebSocket, handleWebSocketMessages } = require("./app/controllers/messages.controller");
initializeWebSocket(io, handleWebSocketMessages);

// Messages routes
require("./app/routes/messages.routes")(app);

// set port, listen for requests
const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
