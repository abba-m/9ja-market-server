const { User } = require("./user");
const { Post } = require("./post");
const { UserAddress } = require("./userAddress");
const { Chat } = require("./chat");
const { Message } = require("./message");

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