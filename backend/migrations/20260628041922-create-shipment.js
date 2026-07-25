"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shipments", {
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

      courier: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      service: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      shipping_cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "PICKED",
          "SHIPPED",
          "DELIVERED",
          "RETURNED",
          "FAILED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      estimated_delivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      shipped_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      delivered_at: {
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

    await queryInterface.addIndex("Shipments", ["status"], {
      name: "shipments_status_idx",
    });

    await queryInterface.addIndex("Shipments", ["courier"], {
      name: "shipments_courier_idx",
    });

    await queryInterface.addIndex("Shipments", ["courier", "tracking_number"], {
      name: "shipments_courier_tracking_idx",
    });

    await queryInterface.addIndex("Shipments", ["status", "shipped_at"], {
      name: "shipments_status_shipped_idx",
    });

    await queryInterface.addIndex("Shipments", ["shipped_at"], {
      name: "shipments_shipped_at_idx",
    });

    await queryInterface.addIndex("Shipments", ["delivered_at"], {
      name: "shipments_delivered_at_idx",
    });

    await queryInterface.addIndex("Shipments", ["createdAt"], {
      name: "shipments_created_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Shipments");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Shipments_status";',
    );
  },
};
