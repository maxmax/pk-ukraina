const express = require("express");
const http = require("http");
const cors = require("cors");
const { initializeWebSocket } = require("./app/sockets/socket.controller");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const server = http.createServer(app);

// Установка CORS middleware
const corsOptions = {
  origin: process.env.CORS_OPTIONS || "http://localhost:5173"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to pk-ukraina application." });
});

require("./app/routes/statement.routes")(app);
require("./app/routes/fake.routes")(app);

// Инициализация WebSocket
initializeWebSocket(server);

// set port, listen for requests
const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
