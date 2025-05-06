const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(20),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING(900),
      },
      profilePicture: {
        allowNull: true,
        type: DataTypes.STRING(200),
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeSave: async (user, options) => {
          // if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          //}
        },
      },
    }
  );

  return Users;
};
