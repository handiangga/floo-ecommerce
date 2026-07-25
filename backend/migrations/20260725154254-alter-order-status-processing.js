"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status"
      RENAME VALUE 'PROCESS' TO 'PROCESSING';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Orders_status"
      RENAME VALUE 'PROCESSING' TO 'PROCESS';
    `);
  },
};