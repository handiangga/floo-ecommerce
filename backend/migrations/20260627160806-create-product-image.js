"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductImages", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      color_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "Colors",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      image: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      alt: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex("ProductImages", ["product_id"], {
      name: "product_images_product_idx",
    });

    await queryInterface.addIndex("ProductImages", ["color_id"], {
      name: "product_images_color_idx",
    });

    await queryInterface.addIndex("ProductImages", ["sort_order"], {
      name: "product_images_sort_idx",
    });

    await queryInterface.addIndex("ProductImages", ["product_id", "color_id"], {
      name: "product_images_product_color_idx",
    });

    await queryInterface.addIndex("ProductImages", ["is_primary"], {
      name: "product_images_primary_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ProductImages");
  },
};
