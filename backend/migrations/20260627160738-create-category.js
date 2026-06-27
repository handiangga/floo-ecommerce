"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      banner: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
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

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Categories", ["slug"]);

    await queryInterface.addIndex("Categories", ["status"]);

    await queryInterface.addIndex("Categories", ["sort_order"]);

    await queryInterface.addIndex("Categories", ["is_featured"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Categories");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Categories_status";',
    );
  },
};
