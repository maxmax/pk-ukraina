const db = require("../models");
const Statement = db.statement;
const Op = db.Sequelize.Op;

// Create and Save a new Statement
exports.create = (req, res) => {
  // Validate request
  if (!req.body.dateReceiving) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Statement
  const statement = {
    dateReceiving: req.body.dateReceiving,
    diskNumber: req.body.diskNumber,
    outputName: req.body.outputName,
    inputName: req.body.inputName,
    deedNumber: req.body.deedNumber,
    notes: req.body.notes,
    published: req.body.published ? req.body.published : false
  };

  // Save Statement in the database
  Statement.create(statement)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Statement."
      });
    });
};

// Retrieve all Statement from the database.
exports.findAll = (req, res) => {
  const dateReceiving = req.query.dateReceiving;
  var condition = dateReceiving ? { dateReceiving: { [Op.like]: `%${dateReceiving}%` } } : null;

  Statement.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Statement."
      });
    });
};

// Retrieve by Pagination Statement from the database.
exports.findPagination = (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  Statement.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']] // Добавляем сортировку по убыванию даты
  })
    .then(data => {
      const totalPages = Math.ceil(data.count / limit);

      res.send({
        totalItems: data.count,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: limit,
        statements: data.rows,
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Statement."
      });
    });
};

// Find a single Statement with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Statement.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Statement with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Statement with id=" + id
      });
    });
};

// Update a Statement by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Statement.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Statement was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Statement with id=${id}. Maybe Statement was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Statement with id=" + id
      });
    });
};

// Delete a Statement with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Statement.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Statement was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Statement with id=${id}. Maybe Statement was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Statement with id=" + id
      });
    });
};

// Delete all Statement from the database.
exports.deleteAll = (req, res) => {
  Statement.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Statement were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all statement."
      });
    });
};

// find all published Statement
exports.findAllPublished = (req, res) => {
  Statement.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving statement."
      });
    });
};
