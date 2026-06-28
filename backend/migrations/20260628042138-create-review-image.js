"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewImages", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      review_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Reviews",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    // INDEX
    // ===========================

    await queryInterface.addIndex("ReviewImages", ["review_id"], {
      name: "review_images_review_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ReviewImages");
  },
};
