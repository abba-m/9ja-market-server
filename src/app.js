import express from "express";
import morgan from "morgan";
import cors from "cors";
import { constructRes } from "./utils/network.utils";
import { handleRpcResponse } from "./services/rpcServer";

//routers
import authRouter from "./api/auth/auth.routes";
import usersRouter from "./api/users/users.routes";
import postsRouter from "./api/posts/posts.routes";
import chatRouter from "./api/chat/chat.routes";
import { createLogger } from "./utils/utils";

const app = express();
const debug = createLogger("App.js");

//App Setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

//routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/chats", chatRouter);
app.post("/json-rpc", handleRpcResponse);
app.use((_, __, next) => {
  debug.info("received req...");
  next();
});
require("./api/rpcMethods");

//Logging
app.use(morgan("dev"));

app.get("/status", (_, res) => {
  constructRes(res);
});

app.get("/test", (_, res) => {
  res.json({ success: true });
});

export default app;
