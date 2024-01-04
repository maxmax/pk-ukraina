const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const index = require("./index");

jest.mock("sequelize");

describe('Index Tests', () => {
  it('should create Sequelize instance with correct configuration', () => {
    index.sequelize;
    expect(Sequelize).toHaveBeenCalledWith(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
      }
    });
  });

  it('should set Sequelize and sequelize in the db object', () => {
    expect(index.Sequelize).toBe(Sequelize);
    expect(index.sequelize).toBeInstanceOf(Sequelize);
  });
});
