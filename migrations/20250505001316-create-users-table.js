"use strict";
const DataTypes = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
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
        type: DataTypes.STRING(10),
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
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};