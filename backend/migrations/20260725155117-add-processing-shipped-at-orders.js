"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "processing_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Orders", "shipped_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Orders", "processing_at");

    await queryInterface.removeColumn("Orders", "shipped_at");
  },
};
