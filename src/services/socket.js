import { createServer } from "http";
import { verify } from "jsonwebtoken";
import {
  OnlineUsersStore,
  updateUserLastSeen,
} from "../utils/onlineUsersStorage";
import {
  findOrCreateRoom,
  getUserRoomIds,
  createLogger,
} from "../utils/utils";

const debug = createLogger("Socket.js");

const httpServer = createServer();
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO
  .use(async (socket, next) => {
    try {
      if (
        socket.handshake.query &&
        socket.handshake.query.token &&
        socket.handshake.query.token.length > 5
      ) {
        const secret = `${process.env.JWT_SECRET}`;
        const userData = verify(socket.handshake.query.token, secret);

        if (userData?.userId) socket["userId"] = userData.userId;

        // debug.log("[socket:authentication-successful]", {
        //   socketId: socket.id,
        //   userId: socket["userId"],
        // });
        next();
      } else {
        next();
      }
    } catch (error) {
      debug.error({
        socketId: socket.id,
        userId: socket["userId"],
        error,
      });
      next(error);
    }
  })
  .on("connection", (socket) => {
    socket.broadcast.emit("user:connect", {
      userId: socket["userId"],
    });
    OnlineUsersStore.set(socket["userId"], socket.id);
    socket.broadcast.emit("user:new-user-online", {
      userId: socket["userId"],
    });

    socket.on("action:typing", ({ recipientId, isTyping = true }) => {
      // const recipientSocketId = OnlineUsersStore.get(userId);
      // if (!recipientSocketId) return;

      socket.to(recipientId).emit("action:user-typing", { isTyping });
    });

    socket.on("user:join-room", async ({ recipientId }) => {
      const conversation = await findOrCreateRoom(
        recipientId,
        socket["userId"],
      );
      const recipientSocketId = OnlineUsersStore.get(recipientId);
      const { conversationId } = conversation;

      if (!socket["chats"]?.length) {
        socket["chats"] = [];
      }
      socket["chats"].push(conversationId);

      socket.join(conversationId);
      socket.to(recipientSocketId).emit("user:new-user-online", {
        userId: socket["userId"],
      });
    });

    socket.on("user:connect", async () => {
      OnlineUsersStore.set(socket["userId"], socket.id);
      const conversationIds = await getUserRoomIds(socket["userId"]);

      socket.join(conversationIds);
      socket["chats"] = conversationIds;
    });

    socket.on("disconnect", () => {
      OnlineUsersStore.delete(socket["userId"]);
      updateUserLastSeen(socket["userId"]);
      socket.broadcast.emit("user:disconnect", {
        userId: socket["userId"],
      });
      socket.disconnect();
    });
  });

export { socketIO };
