"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Wishlists", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addConstraint("Wishlists", {
      fields: ["customer_id", "product_id"],
      type: "unique",
      name: "wishlist_customer_product_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Wishlists", ["customer_id"], {
      name: "wishlists_customer_idx",
    });

    await queryInterface.addIndex("Wishlists", ["product_id"], {
      name: "wishlists_product_idx",
    });

    await queryInterface.addIndex("Wishlists", ["customer_id", "product_id"], {
      name: "wishlists_customer_product_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Wishlists");
  },
};
