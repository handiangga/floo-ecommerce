"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Roles", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // ===========================
    // UNIQUE
    // ===========================

    await queryInterface.addConstraint("Roles", {
      fields: ["name"],
      type: "unique",
      name: "roles_name_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Roles", ["name"], {
      name: "roles_name_idx",
    });

    await queryInterface.addIndex("Roles", ["status"], {
      name: "roles_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Roles");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Roles_status";',
    );
  },
};
