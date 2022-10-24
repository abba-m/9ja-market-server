const { sequelizeConn, DataTypes } = require("../config/db");

const Chat = sequelizeConn.define("Chat", {
  chatId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userOne: {
    type: DataTypes.UUID,
  },
  userTwo: {
    type: DataTypes.UUID,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  }
},
{
  paranoid: true,
  freezeTableName: true,
}
);

module.exports = { Chat };
