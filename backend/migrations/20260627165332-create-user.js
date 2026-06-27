"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      role_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

      photo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      last_login: {
        type: Sequelize.DATE,
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

    // UNIQUE
    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "users_email_unique",
    });

    await queryInterface.addConstraint("Users", {
      fields: ["phone"],
      type: "unique",
      name: "users_phone_unique",
    });

    // INDEX
    await queryInterface.addIndex("Users", ["role_id"], {
      name: "users_role_idx",
    });

    await queryInterface.addIndex("Users", ["email"], {
      name: "users_email_idx",
    });

    await queryInterface.addIndex("Users", ["phone"], {
      name: "users_phone_idx",
    });

    await queryInterface.addIndex("Users", ["status"], {
      name: "users_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_status";',
    );
  },
};
