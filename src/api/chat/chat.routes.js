import express from "express";
const router = express.Router();

import { createLogger, findOrCreateRoom } from "../../utils/utils";
import { isAuth } from "../../middlewares/auth.middlewares";
import { Message } from "../../models";
import { socketIO } from "../../services/socket";
import { constructError, constructRes } from "../../utils/network.utils";
import { OnlineUsersStore } from "../../utils/onlineUsersStorage";

const debug = createLogger("ChatRoutes");

router.post("/send-message", isAuth, async (req, res) => {
  const userId = req.user?.userId;
  const { messageId, recipientId, text, createdAt } = req.body;

  try {
    if (!text) throw "Message text cannot be null";

    const recipientSocketId = OnlineUsersStore.get(recipientId);
    const room = await findOrCreateRoom(userId, recipientId);

    const data = {
      messageId,
      text,
      senderId: userId,
      recipientId,
      chatId: room.chatId,
      createdAt,
    };

    const newMessage = await Message.create(data);

    if (recipientSocketId) {
      socketIO
        .to(recipientSocketId)
        .emit("action:user-typing", { isTyping: false });
      socketIO
        .to(recipientSocketId)
        .emit("message:receive-message", newMessage);
    }

    constructRes(res, 201, newMessage);
  } catch (error) {
    debug.error(error);
    constructError(
      res,
      400,
      error.message ?? "Error occured",
      error?.toString(),
    );
  }
});

export default router;
