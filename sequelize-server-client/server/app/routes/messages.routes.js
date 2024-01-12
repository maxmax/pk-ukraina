module.exports = (app) => {
  const messagesController = require('../controllers/messages.controller');
  const router = require("express").Router();
  
  router.get("/", messagesController.getMessages);
  router.post("/", messagesController.postMessage);

  app.use("/api/messages", router);
};
