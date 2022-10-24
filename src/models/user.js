const { sequelizeConn, DataTypes } = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelizeConn.define("User", {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.VIRTUAL(DataTypes.STRING, ["firstName", "lastName"]),
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
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
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: null,
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

User.beforeSave(async user => {
  user.email = user.email?.toLowerCase();
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeCreate(async user => {
  user.email = user.email?.toLowerCase();
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = { User };
