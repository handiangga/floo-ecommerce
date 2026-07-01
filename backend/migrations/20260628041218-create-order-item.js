"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_variant_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "ProductVariants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      product_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      product_image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      color_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      size_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      subtotal: {
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

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("OrderItems", ["order_id"], {
      name: "order_items_order_idx",
    });

    await queryInterface.addIndex("OrderItems", ["product_variant_id"], {
      name: "order_items_variant_idx",
    });

    await queryInterface.addIndex("OrderItems", ["sku"], {
      name: "order_items_sku_idx",
    });

    await queryInterface.addIndex(
      "OrderItems",
      ["order_id", "product_variant_id"],
      {
        name: "order_items_order_variant_idx",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("OrderItems");
  },
};
