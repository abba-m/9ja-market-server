import { User } from "./user";
import { Post } from "./post";
import { UserAddress } from "./userAddress";
import { Chat } from "./chat";
import { Message } from "./message";

User.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

UserAddress.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(UserAddress, {
  foreignKey: "userId",
});

Chat.hasMany(Message, {
  foreignKey: "chatId",
});

Message.belongsTo(Chat, {
  foreignKey: "chatId",
});
