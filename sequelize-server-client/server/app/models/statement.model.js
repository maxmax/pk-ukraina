module.exports = (sequelize, Sequelize) => {
    const Statement = sequelize.define("statement", {
      dateReceiving: {
        type: Sequelize.STRING
      },
      diskNumber: {
        type: Sequelize.STRING
      },
      outputName: {
        type: Sequelize.STRING
      },
      inputName: {
        type: Sequelize.STRING
      },
      deedNumber: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Statement;
  };