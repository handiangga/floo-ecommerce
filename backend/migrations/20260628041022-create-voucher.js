"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vouchers", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
      },

      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      min_purchase: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      max_discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
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

    await queryInterface.addIndex("Vouchers", ["code"], {
      name: "voucher_code_idx",
    });

    await queryInterface.addIndex("Vouchers", ["status"], {
      name: "voucher_status_idx",
    });

    await queryInterface.addIndex("Vouchers", ["type"], {
      name: "voucher_type_idx",
    });

    await queryInterface.addIndex("Vouchers", ["start_date"], {
      name: "voucher_start_idx",
    });

    await queryInterface.addIndex("Vouchers", ["end_date"], {
      name: "voucher_end_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Vouchers");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Vouchers_type";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Vouchers_status";',
    );
  },
};
