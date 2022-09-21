const { sequelizeConn, DataTypes } = require("../config/database/db");

const User = sequelizeConn.define("User", {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.TEXT,
    defaultValue: "local",
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  passwordResetCode: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  expiresIn: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  avatarUrl: {
    type: DataTypes.TEXT,
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

module.exports = { User };