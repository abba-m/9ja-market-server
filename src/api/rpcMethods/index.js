const { rpcServer } = require("./rpcServer");

/**AUTH */
require("./auth.rpc");

// const test = async ({ text }) => {
//   return { server: `rpc server recieved (${text})` };
// };

// rpcServer.addMethod("test", test);