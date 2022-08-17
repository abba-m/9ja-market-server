const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const { config } = require("dotenv");

config({
  path: path.join(__dirname, "../../../.env"),
});

const dbName = `${process.env.DB_NAME}`;
const dbUserName = `${process.env.DB_USERNAME}`;
const dbPassword = `${process.env.DB_PASSWORD}`;

const sequelizeConn = new Sequelize(dbName, dbUserName, dbPassword, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    host: process.env.DB_SERVER_DEV,
  },
  /*  pool: {
      max: 100,
      min: 0,
      idle: 200000,
      acquire: 1000000,
    } */
});

module.exports = { sequelizeConn, DataTypes };