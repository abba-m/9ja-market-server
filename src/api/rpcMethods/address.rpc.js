const { UserAddress } = require("../../models");
const { rpcServer } = require("../../services/rpcServer");
const { createLogger } = require("../../utils/utils");
const debug = createLogger("AddressRPC");

const createAddress = async (data, { user = {} }) => {
  const { userId } = user;

  if (!userId) return null;

  try {
    data.userId = userId;
    delete data.country;

    return UserAddress.create(data);
  } catch (err) {
    debug.error("[CREATE_ADDRESS_ERR]:", err);
    return null;
  }
};

const getAddresses = (_, { user = {} }) => {
  const { userId } = user;

  if (!userId) return null;

  try {
    return UserAddress.findAll({
      where: { userId },
    });
  } catch (err) {
    debug.error("[CREATE_ADDRESS_ERR]:", err);
    return null;
  }
};
const deleteAddress = async ({ userAddressId }, { user = {} }) => {
  const { userId } = user;

  if (!userId) return null;

  try {
    await UserAddress.destroy({
      where: {
        userId,
        userAddressId,
      },
    });

    return true;
  } catch (err) {
    debug.error("[CREATE_ADDRESS_ERR]:", err);
    return null;
  }
};

rpcServer.addMethod("createAddress", createAddress);
rpcServer.addMethod("getAddresses", getAddresses);
rpcServer.addMethod("deleteAddress", deleteAddress);
