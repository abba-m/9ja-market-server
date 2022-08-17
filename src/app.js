const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const morgan = require("morgan");
const cors = require("cors");
const { constructRes } = require("./utils/network.utils");

//routers
const authRouter = require("./api/auth/auth.routes");
const usersRouter = require("./api/users/users.routes");
const postsRouter = require("./api/posts/posts.routes");

//graphQL
const rootSchema = require("./graphql/schemas/index");
const rootResolver = require("./graphql/resolvers/index");

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
app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: rootResolver,
    graphiql: true,
  })
);

//Logging
app.use(morgan("dev"));

app.get("/status", (_, res) => {
  constructRes(res);
});

module.exports = app;
