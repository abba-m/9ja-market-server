const { User } = require("./user");
const { Post } = require("./post");
const { UserAddress } = require("./userAddress");

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
