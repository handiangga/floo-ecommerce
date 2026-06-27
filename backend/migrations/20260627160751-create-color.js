"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Colors", {
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

      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addConstraint("Colors", {
      fields: ["name"],
      type: "unique",
      name: "colors_name_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Colors", ["name"], {
      name: "colors_name_idx",
    });

    await queryInterface.addIndex("Colors", ["status"], {
      name: "colors_status_idx",
    });

    await queryInterface.addIndex("Colors", ["sort_order"], {
      name: "colors_sort_order_idx",
    });

    await queryInterface.addIndex("Colors", ["status", "sort_order"], {
      name: "colors_status_sort_order_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Colors");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Colors_status";',
    );
  },
};
