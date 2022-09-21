const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { constructRes } = require("./utils/network.utils");
const { handleRpcResponse } = require("./services/rpcServer");

//routers
const authRouter = require("./api/auth/auth.routes");
const usersRouter = require("./api/users/users.routes");
const postsRouter = require("./api/posts/posts.routes");

const app = express();

//App Setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.post("/json-rpc", handleRpcResponse);
require("./services/rpcMethods");

//Logging
app.use(morgan("dev"));

app.get("/status", (_, res) => {
  constructRes(res);
});

module.exports = app;
