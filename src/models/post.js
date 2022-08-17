const { sequelizeConn, DataTypes } = require("../config/database/db");

const Post = sequelizeConn.define("Post", {
  postId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(12, 2)
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "OTHERS",
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  location: {
    type: DataTypes.STRING
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
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

module.exports = { Post };
