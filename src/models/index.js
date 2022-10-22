const { User } = require("./user");
const { Post } = require("./post");
const { UserAddress } = require("./userAddress");

require("./tablereferences");

module.exports = { User, Post, UserAddress };
