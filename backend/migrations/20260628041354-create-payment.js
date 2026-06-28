"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      method: {
        type: Sequelize.ENUM(
          "BANK_TRANSFER",
          "QRIS",
          "E_WALLET",
          "CREDIT_CARD",
          "COD",
        ),
        allowNull: false,
      },

      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "MIDTRANS",
      },

      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      snap_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      payment_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "PAID",
          "FAILED",
          "EXPIRED",
          "REFUNDED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      expired_at: {
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

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Payments", ["order_id"], {
      name: "payments_order_idx",
    });

    await queryInterface.addIndex("Payments", ["status"], {
      name: "payments_status_idx",
    });

    await queryInterface.addIndex("Payments", ["transaction_id"], {
      name: "payments_transaction_idx",
    });

    await queryInterface.addIndex("Payments", ["provider"], {
      name: "payments_provider_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Payments");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_method";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_status";',
    );
  },
};
