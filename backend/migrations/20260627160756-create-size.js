"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sizes", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addConstraint("Sizes", {
      fields: ["name"],
      type: "unique",
      name: "sizes_name_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Sizes", ["name"], {
      name: "sizes_name_idx",
    });

    await queryInterface.addIndex("Sizes", ["status"], {
      name: "sizes_status_idx",
    });

    await queryInterface.addIndex("Sizes", ["sort_order"], {
      name: "sizes_sort_order_idx",
    });

    await queryInterface.addIndex("Sizes", ["status", "sort_order"], {
      name: "sizes_status_sort_order_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Sizes");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Sizes_status";',
    );
  },
};
