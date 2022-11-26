module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Post", {
      postId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
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
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
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
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("Post");
  },
};
