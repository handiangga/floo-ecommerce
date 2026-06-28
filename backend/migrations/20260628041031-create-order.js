"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
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
        onDelete: "RESTRICT",
      },

      address_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      invoice: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      shipping_cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "PROCESS",
          "SHIPPED",
          "COMPLETED",
          "CANCELLED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      notes: {
        type: Sequelize.TEXT,
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

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Orders", ["customer_id"], {
      name: "orders_customer_idx",
    });

    await queryInterface.addIndex("Orders", ["address_id"], {
      name: "orders_address_idx",
    });

    await queryInterface.addIndex("Orders", ["invoice"], {
      name: "orders_invoice_idx",
    });

    await queryInterface.addIndex("Orders", ["status"], {
      name: "orders_status_idx",
    });

    await queryInterface.addIndex("Orders", ["createdAt"], {
      name: "orders_created_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Orders");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_status";',
    );
  },
};
