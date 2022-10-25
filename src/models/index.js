const { User } = require("./user");
const { Post } = require("./post");
const { UserAddress } = require("./userAddress");
const { Chat } = require("./chat");
const { Message } = require("./message");

require("./tablereferences");

module.exports = { User, Post, UserAddress, Chat, Message };
