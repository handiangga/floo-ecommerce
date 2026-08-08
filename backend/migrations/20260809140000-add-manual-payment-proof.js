"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Payments", "proof_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Payments", "proof_path", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn("Payments", "proof_submitted_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("Payments", "verification_note", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Payments", "verification_note");
    await queryInterface.removeColumn("Payments", "proof_submitted_at");
    await queryInterface.removeColumn("Payments", "proof_path");
    await queryInterface.removeColumn("Payments", "proof_url");
  },
};
