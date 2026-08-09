"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Categories", "parent_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "Categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },
  async down(queryInterface) { await queryInterface.removeColumn("Categories", "parent_id"); },
};
