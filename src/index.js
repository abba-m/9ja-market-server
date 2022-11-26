import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { socketIO } from "./services/socket";
import { sequelizeConn } from "./config/db";
import { normalizePort, createLogger } from "./utils/utils";
import { v2 as cloudinary } from "cloudinary";

const debug = createLogger("ServerSetup");
// load env configs
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// server setup
const PORT = normalizePort(process.env.PORT || 5001);
const server = http.createServer(app);
socketIO.attach(server);

// database conn
server.listen(PORT, async () => {
  await sequelizeConn.sync();

  sequelizeConn.authenticate().then(() => {
    debug.info(`Server running on port: ${PORT}`);
  });
});
