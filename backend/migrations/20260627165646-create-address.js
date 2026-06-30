"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Addresses", {
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

      receiver_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      label: {
        type: Sequelize.ENUM("HOME", "OFFICE", "OTHER"),
        allowNull: false,
        defaultValue: "HOME",
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

      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },

      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },

      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
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

    await queryInterface.addIndex("Addresses", ["customer_id"], {
      name: "addresses_customer_idx",
    });

    await queryInterface.addIndex("Addresses", ["is_default"], {
      name: "addresses_default_idx",
    });

    await queryInterface.addIndex("Addresses", ["postal_code"], {
      name: "addresses_postal_code_idx",
    });

    await queryInterface.addIndex("Addresses", ["customer_id", "is_default"], {
      name: "addresses_customer_default_idx",
    });

    await queryInterface.addIndex("Addresses", ["status"], {
      name: "addresses_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Addresses");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Addresses_status";',
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Addresses_label";',
    );
  },
};
