import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, "../../.env"),
});

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_NAME,
    host: process.env.DB_SERVER_DEV,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_NAME,
    host: process.env.DB_SERVER_DEV,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_NAME,
    host: process.env.DB_SERVER_PROD,
    dialect: "mysql",
  },
};
