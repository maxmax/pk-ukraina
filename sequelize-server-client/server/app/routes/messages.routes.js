module.exports = (app) => {
  const messagesController = require('../controllers/messages.controller');
  const router = require("express").Router();

  // Messages
  router.get("/", messagesController.getMessages);
  router.post("/", messagesController.postMessage);

  app.use("/api/messages", router);
};
