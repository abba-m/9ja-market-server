const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
//const connectDB = require("./config/db")
const { sequelizeConn } = require("./config/database/db");
const { normalizePort } = require("./utils/utils");
const cloudinary = require("cloudinary").v2;

// load env configs
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

// server setup
const PORT = normalizePort(process.env.PORT || 5001);
const server = http.createServer(app);


// database conn
server.listen(PORT, async () => {
  await sequelizeConn.sync();

  sequelizeConn.authenticate().then(() => {
    console.log(`Server running on port: ${PORT}`);
  });
});
