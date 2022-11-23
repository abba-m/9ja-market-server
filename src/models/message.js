import { sequelizeConn, DataTypes } from "../config/db";

export const Message = sequelizeConn.define(
  "Message",
  {
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      references: {
        model: "Chat",
        key: "chatId",
      },
    },
    senderId: {
      type: DataTypes.UUID,
    },
    recipientId: {
      type: DataTypes.UUID,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  },
);
