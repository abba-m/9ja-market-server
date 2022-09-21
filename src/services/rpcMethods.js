const { rpcServer } = require("./rpcServer");

const test = async ({ text }) => {
  return { server: `rpc server recieved (${text})` };
};

rpcServer.addMethod("test", test);