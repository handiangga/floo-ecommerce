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
        type: Sequelize.ENUM("MIDTRANS", "XENDIT", "MANUAL"),
        allowNull: false,
        defaultValue: "MANUAL",
      },

      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      snap_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      payment_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      webhook_payload: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "PAID",
          "FAILED",
          "EXPIRED",
          "CANCELLED",
          "REFUNDED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      payment_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      verified_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      failed_reason: {
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
    await queryInterface.addIndex("Payments", ["method"], {
      name: "payments_method_idx",
    });
    await queryInterface.addIndex("Payments", ["payment_code"], {
      name: "payments_code_idx",
    });

    await queryInterface.addIndex("Payments", ["paid_at"], {
      name: "payments_paid_at_idx",
    });
    await queryInterface.addIndex("Payments", ["expired_at"], {
      name: "payments_expired_at_idx",
    });
    await queryInterface.addIndex("Payments", ["createdAt"], {
      name: "payments_created_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("Payments", "payments_order_idx");
    await queryInterface.removeIndex("Payments", "payments_status_idx");
    await queryInterface.removeIndex("Payments", "payments_transaction_idx");
    await queryInterface.removeIndex("Payments", "payments_provider_idx");
    await queryInterface.removeIndex("Payments", "payments_method_idx");
    await queryInterface.removeIndex("Payments", "payments_code_idx");
    await queryInterface.removeIndex("Payments", "payments_paid_at_idx");
    await queryInterface.removeIndex("Payments", "payments_expired_at_idx");

    await queryInterface.dropTable("Payments");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_method";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payments_provider";',
    );
  },
};
