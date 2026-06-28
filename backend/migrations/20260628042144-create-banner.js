"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Banners", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      button_text: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // ======================
    // INDEX
    // ======================

    await queryInterface.addIndex("Banners", ["status"], {
      name: "banners_status_idx",
    });

    await queryInterface.addIndex("Banners", ["sort_order"], {
      name: "banners_sort_idx",
    });

    await queryInterface.addIndex("Banners", ["is_featured"], {
      name: "banners_featured_idx",
    });

    await queryInterface.addIndex("Banners", ["start_date"], {
      name: "banners_start_idx",
    });

    await queryInterface.addIndex("Banners", ["end_date"], {
      name: "banners_end_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Banners");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Banners_status";',
    );
  },
};
