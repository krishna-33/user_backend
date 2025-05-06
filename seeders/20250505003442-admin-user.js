'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    await queryInterface.bulkInsert('users', [{
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      phoneNumber: "9078907899",
      address: "Head Office",
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'User',
      email: 'user@example.com',
      password: userPassword,
      phoneNumber: "9078907811",
      address: "Main Office",
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users');
  }
};
