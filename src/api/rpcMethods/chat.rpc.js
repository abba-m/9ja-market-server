const { User, UserAddress, Message, Chat } = require("../../models");
const { rpcServer } = require("../../services/rpcServer");
const { Op } = require("sequelize");
const { OnlineUsersStore } = require("../../utils/onlineUsersStorage");


const getUserChats = async (_, { user = {} }) => {
  const { userId } = user;
  if (!userId) {
    throw new Error("Access denied");
  }

  return Chat.findAll({
    where: {
      [Op.or]: [{
        userOne: userId,
      }, {
        userTwo: userId,
      }]
    },
    include: [
      {
        model: Message,
        foreignKey: "chatId",
        order: [["createdAt", "DESC"]],
        limit: 1,
        required: true,
      },
    ]
  });
};

const getUserOnline = async ({ recipientId }, { user = {} }) => {
  const { userId } = user;
  if (!userId) {
    throw new Error("Access denied");
  }

  const found = await User.findOne({
    where: { userId: recipientId },
    attributes: { exclude: ["password"] },
  });

  if (!found) {
    throw new Error("No user found");
  }

  const isOnline = OnlineUsersStore.get(found?.userId) ? true : false;

  return { isOnline, user: found };
};

rpcServer.addMethod("getUserChats", getUserChats);
rpcServer.addMethod("getUserOnline", getUserOnline);
// rpcServer.addMethod("getUserById", getUserById);


