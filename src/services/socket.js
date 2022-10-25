const { createServer } = require("http");
const { verify } = require("jsonwebtoken");
const { OnlineUsersStore, updateUserLastSeen } = require("../utils/onlineUsersStorage");
const { User, Message } = require("../models");
const { findOrCreateRoom, getUserRoomIds } = require("../utils/utils");

const httpServer = createServer();
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

/**
 * EVENTS         =>      EMITING DATA            => RECEIVING DATA
 * user:join               Null,                     userId,
 * user:disconnect         Null,                     userId,
 * user:join-room          RecipientId,              userId,
 * message:send-message    [ReceipientId, msg ]        --
 * message:receive-message        --                 MessageModel
 */

socketIO.use(async (socket, next) => {
  console.log("[socket:authenticating]:", { socketId: socket.id, userId: socket["userId"] });

  try {
    if (
      socket.handshake.query &&
      socket.handshake.query.token &&
      socket.handshake.query.token.length > 5
    ) {
      const secret = `${process.env.JWT_SECRET}`;
      const userData =  verify(socket.handshake.query.token, secret);

      if (userData?.userId) socket["userId"] = userData.userId;

      console.log("[socket:authentication-successful]", {
        socketId: socket.id,
        userId: socket["userId"],
      });
      next();
    } else {
      next();
    }
  } catch (error) {
    console.error("[socket:authentication-error]:", {
      socketId: socket.id,
      userId: socket["userId"],
      error,
    });
    next(error);
  }
}).on("connection", (socket) => {
  socket.broadcast.emit("user:connect", { userId: socket["userId"] });
  socket.on("message:send-message", async ({ recipientId, message }) => {
    const recipientSocketId = OnlineUsersStore.get(recipientId);
    const room = await findOrCreateRoom(socket["userId"], recipientId);
    
    const data = {
      text: message,
      senderId: socket["userId"],
      recipientId,
      chatId: room.chatId,
    };
    const resp = await Message.create(data);

    if (recipientSocketId) {
      socketIO.to(recipientSocketId).emit("action:user-typing", { isTyping: false });
      socketIO.to(recipientSocketId).emit("message:receive-message", resp);
    } 
  });

  socket.on("action:typing", ({ recipientId, isTyping = true }) => {
    // const recipientSocketId = OnlineUsersStore.get(userId);
    // if (!recipientSocketId) return;

    socket.to(recipientId).emit("action:user-typing", { isTyping  });
  });

  socket.on("user:join-room", async ({ recipientId }) => {
    const conversation = await findOrCreateRoom(recipientId, socket["userId"]);
    const recipientSocketId = OnlineUsersStore.get(recipientId);
    const { conversationId } = conversation;

    if (!socket["chats"]?.length) {
      socket["chats"] = [];
    }
    socket["chats"].push(conversationId);

    socket.join(conversationId);
    socket.to(recipientSocketId).emit("user:new-user-online", { userId: socket["userId"] });
  });

  socket.on("user:connect", async () => {
    OnlineUsersStore.set(socket["userId"], socket.id);
    const conversationIds = await getUserRoomIds(socket["userId"]);

    socket.join(conversationIds);
    socket["chats"] = conversationIds;
    socket.broadcast.emit("user:new-user-online", { userId: socket["userId"] });
  });

  socket.on("disconnect", () => {
    console.log(`🔥${socket.id} disconnected`);
    OnlineUsersStore.delete(socket["userId"]);
    updateUserLastSeen(socket["userId"]);
    socket.broadcast.emit("user:disconnect", { userId: socket["userId"] });
    socket.disconnect();
  });
  
});

module.exports = { socketIO };
