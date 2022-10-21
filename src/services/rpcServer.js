const jwt = require("jsonwebtoken");
const { JSONRPCServer, createJSONRPCErrorResponse } = require("json-rpc-2.0");

const rpcServer = new JSONRPCServer();

const handleRpcResponse = (req, res) => {
  const jsonRPCRequest = req.body;
  const credentials = isAuth(req);

  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  rpcServer.receive(jsonRPCRequest, credentials).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204);
    }
  });
};

const isAuth = (req) => {
  const credentials = { isAuth: false };

  try {
    const token = req.header("Authorization");

    if (!token) return credentials;

    const decodedToken = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decodedToken) return credentials;

    credentials.isAuth = true;
    credentials.user = decodedToken;

    return credentials;
  } catch (err) {
    console.log("authErr[rpcReq]:", err);
    return { isAuth: false };
  }
};

const exceptionMiddleware = async (next, request, serverParams) => {
  try {
    return await next(request, serverParams);
  } catch (error) {
    if (error.code) {
      return createJSONRPCErrorResponse(request.id, error.code, error.message);
    } else {
      throw error;
    }
  }
};

rpcServer.applyMiddleware(exceptionMiddleware);

module.exports = {
  handleRpcResponse,
  rpcServer,
};