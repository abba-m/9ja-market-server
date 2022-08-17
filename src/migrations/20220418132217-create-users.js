module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("User", {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      provider: {
        type: DataTypes.TEXT
      },
      phone: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING
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
        type: DataTypes.STRING
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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("User");
  }
};