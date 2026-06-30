"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      cart_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Carts",
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

      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      selected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addConstraint("CartItems", {
      fields: ["cart_id", "product_variant_id"],
      type: "unique",
      name: "cart_items_cart_variant_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("CartItems", ["cart_id"], {
      name: "cart_items_cart_idx",
    });

    await queryInterface.addIndex("CartItems", ["product_variant_id"], {
      name: "cart_items_variant_idx",
    });

    await queryInterface.addIndex("CartItems", ["selected"], {
      name: "cart_items_selected_idx",
    });

    await queryInterface.addIndex(
      "CartItems",
      ["cart_id", "product_variant_id"],
      {
        name: "cart_items_cart_variant_idx",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("CartItems");
  },
};
