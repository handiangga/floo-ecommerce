"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
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

      order_item_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: "OrderItems",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
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

    await queryInterface.addIndex("Reviews", ["customer_id"], {
      name: "reviews_customer_idx",
    });

    await queryInterface.addIndex("Reviews", ["product_id"], {
      name: "reviews_product_idx",
    });

    await queryInterface.addIndex("Reviews", ["order_item_id"], {
      name: "reviews_order_item_idx",
    });

    await queryInterface.addIndex("Reviews", ["status"], {
      name: "reviews_status_idx",
    });

    await queryInterface.addIndex("Reviews", ["rating"], {
      name: "reviews_rating_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Reviews");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Reviews_status";',
    );
  },
};
