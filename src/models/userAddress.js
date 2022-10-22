const { sequelizeConn, DataTypes } = require("../config/db");

const UserAddress = sequelizeConn.define("UserAddress", {
  userAddressId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },

  userId: {
    type: DataTypes.UUID,
    references: {
      model: "User",
      key: "userId",
    },
  },

  street: {
    type: DataTypes.STRING,
    defaultValue: null,
  },

  city: {
    type: DataTypes.STRING,
    defaultValue: null,
  },

  state: {
    type: DataTypes.STRING,
    defaultValue: null,
  },

  zipcode: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, { paranoid: true, freezeTableName: true } );

module.exports = { UserAddress };