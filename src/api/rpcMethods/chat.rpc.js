import { User, Message, Chat } from "../../models";
import { rpcServer } from "../../services/rpcServer";
import { findOrCreateRoom, backDate, createLogger } from "../../utils/utils";
import { Op } from "sequelize";
import { OnlineUsersStore } from "../../utils/onlineUsersStorage";

const debug = createLogger("ChatRPC");

const getUserChats = async (_, { user = {} }) => {
  const { userId } = user;
  if (!userId) {
    throw new Error("Access denied");
  }

  try {
    return Chat.findAll({
      where: {
        [Op.or]: [
          {
            userOne: userId,
          },
          {
            userTwo: userId,
          },
        ],
      },
      include: [
        {
          model: Message,
          foreignKey: "chatId",
          order: [["createdAt", "DESC"]],
          limit: 1,
          required: true,
        },
      ],
    });
  } catch (err) {
    debug.error("[getUserChats][ERR]:", err);
  }
};

const getUserOnline = async ({ recipientId }, { user = {} }) => {
  const { userId } = user;
  if (!userId) {
    throw new Error("Access denied");
  }

  if (!recipientId) return;

  try {
    const found = await User.findOne({
      where: { userId: recipientId },
      attributes: { exclude: ["password"] },
    });

    if (!found) {
      throw new Error("No user found");
    }

    const isOnline = OnlineUsersStore.get(found?.userId) ? true : false;

    return { isOnline, user: found };
  } catch (err) {
    debug.error("[getUserOnline][ERR]:", err);
  }
};

const getChatMessages = async ({ recipientId }, { user = {} }) => {
  const { userId } = user;

  if (!userId) throw new Error("Access denied");
  if (!recipientId) return;

  try {
    const room = await findOrCreateRoom(recipientId, userId);

    const messages = await Message.findAll({
      where: { chatId: room.chatId },
      [Op.between]: [backDate("3d"), new Date()],
      order: [["createdAt", "ASC"]],
    });

    return messages;
  } catch (err) {
    debug.error("[getChatMessages][ERR]:", err);
  }
};

rpcServer.addMethod("getUserChats", getUserChats);
rpcServer.addMethod("getUserOnline", getUserOnline);
rpcServer.addMethod("getChatMessages", getChatMessages);
