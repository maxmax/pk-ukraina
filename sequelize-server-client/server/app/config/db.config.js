module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Kotiki26",
  DB: "pk_tiger",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
