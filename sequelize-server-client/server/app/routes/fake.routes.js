module.exports = (app) => {
  const users = require("../controllers/fake.controller.js");
  const router = require("express").Router();

  // Get Fake Users
  router.get("/", users.generateUsers);

  app.use("/api/fake/users", router);
};
