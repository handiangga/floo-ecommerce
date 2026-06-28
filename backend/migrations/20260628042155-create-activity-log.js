"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActivityLogs", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      module: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      metadata: {
        type: Sequelize.JSONB,
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

    // ======================
    // INDEX
    // ======================

    await queryInterface.addIndex("ActivityLogs", ["user_id"], {
      name: "activity_logs_user_idx",
    });

    await queryInterface.addIndex("ActivityLogs", ["module"], {
      name: "activity_logs_module_idx",
    });

    await queryInterface.addIndex("ActivityLogs", ["action"], {
      name: "activity_logs_action_idx",
    });

    await queryInterface.addIndex("ActivityLogs", ["createdAt"], {
      name: "activity_logs_created_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ActivityLogs");
  },
};
