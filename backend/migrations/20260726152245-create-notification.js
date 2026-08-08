"use strict";

/**
 * Upgrade the initial Notifications table instead of creating it a second time.
 * This migration must remain safe for an empty production database.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const hasNotifications = tables.some(
      (table) => String(table).toLowerCase() === "notifications",
    );

    if (!hasNotifications) {
      await queryInterface.createTable("Notifications", {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        customer_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        is_read: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        reference_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
      return;
    }

    const columns = await queryInterface.describeTable("Notifications");

    if (!columns.user_id) {
      await queryInterface.addColumn("Notifications", "user_id", {
        type: Sequelize.BIGINT,
        allowNull: true,
      });
    }

    if (!columns.reference_id) {
      await queryInterface.addColumn("Notifications", "reference_id", {
        type: Sequelize.BIGINT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasNotifications = tables.some(
      (table) => String(table).toLowerCase() === "notifications",
    );
    if (!hasNotifications) return;

    const columns = await queryInterface.describeTable("Notifications");
    if (columns.reference_id) {
      await queryInterface.removeColumn("Notifications", "reference_id");
    }
    if (columns.user_id) {
      await queryInterface.removeColumn("Notifications", "user_id");
    }
  },
};
