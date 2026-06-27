"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Customers", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      gender: {
        type: Sequelize.ENUM("MALE", "FEMALE"),
        allowNull: true,
      },

      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      photo: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // ===========================
    // UNIQUE
    // ===========================

    await queryInterface.addConstraint("Customers", {
      fields: ["email"],
      type: "unique",
      name: "customers_email_unique",
    });

    await queryInterface.addConstraint("Customers", {
      fields: ["phone"],
      type: "unique",
      name: "customers_phone_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Customers", ["email"], {
      name: "customers_email_idx",
    });

    await queryInterface.addIndex("Customers", ["phone"], {
      name: "customers_phone_idx",
    });

    await queryInterface.addIndex("Customers", ["status"], {
      name: "customers_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Customers");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Customers_gender";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Customers_status";',
    );
  },
};
