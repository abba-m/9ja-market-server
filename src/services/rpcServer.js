import jwt from "jsonwebtoken";
import { JSONRPCServer, createJSONRPCErrorResponse } from "json-rpc-2.0";
import { createLogger } from "../utils/utils";

const debug = createLogger("RPCServerSetup");

export const rpcServer = new JSONRPCServer();

export const handleRpcResponse = (req, res) => {
  const jsonRPCRequest = req.body;
  const credentials = isAuth(req);

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

    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET,
    );

    if (!decodedToken) return credentials;

    credentials.isAuth = true;
    credentials.user = decodedToken;

    return credentials;
  } catch (err) {
    debug.error(err);
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
