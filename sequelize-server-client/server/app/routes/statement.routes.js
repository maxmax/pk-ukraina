module.exports = app => {
    const statement = require("../controllers/statement.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Statement
    router.post("/", statement.create);
  
    // Retrieve all Statement
    router.get("/", statement.findAll);
  
    // Retrieve all published Statement
    router.get("/published", statement.findAllPublished);
  
    // Retrieve a single Statement with id
    router.get("/:id", statement.findOne);
  
    // Update a Statement with id
    router.put("/:id", statement.update);
  
    // Delete a Statement with id
    router.delete("/:id", statement.delete);
  
    // Delete all Statement
    router.delete("/", statement.deleteAll);
  
    app.use('/api/statement', router);
  };
  