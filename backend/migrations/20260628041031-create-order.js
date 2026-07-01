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

      voucher_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "Vouchers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      invoice: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      receiver_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      receiver_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      province: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      district: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      subdistrict: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      postal_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      shipping_method: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      courier_service: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      shipping_cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      payment_method: {
        type: Sequelize.ENUM(
          "BANK_TRANSFER",
          "QRIS",
          "E_WALLET",
          "CREDIT_CARD",
          "COD",
        ),
        allowNull: true,
      },

      payment_deadline: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "WAITING_PAYMENT",
          "PAID",
          "PROCESS",
          "SHIPPED",
          "COMPLETED",
          "CANCELLED",
          "EXPIRED",
          "REFUNDED",
        ),
        allowNull: false,
        defaultValue: "WAITING_PAYMENT",
      },

      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      refunded_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("Orders", ["voucher_id"], {
      name: "orders_voucher_idx",
    });

    await queryInterface.addIndex("Orders", ["invoice"], {
      name: "orders_invoice_idx",
    });

    await queryInterface.addIndex("Orders", ["status"], {
      name: "orders_status_idx",
    });

    await queryInterface.addIndex("Orders", ["tracking_number"], {
      name: "orders_tracking_idx",
    });

    await queryInterface.addIndex("Orders", ["payment_method"], {
      name: "orders_payment_method_idx",
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

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_payment_method";',
    );
  },
};
