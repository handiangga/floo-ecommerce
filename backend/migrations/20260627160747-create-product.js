"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      category_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(180),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      material: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      brand: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "Floo Fashionn",
      },

      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_ready_stock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      is_preorder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      preorder_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      view_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      sold_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      seo_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      seo_description: {
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
    // UNIQUE
    // ===========================

    await queryInterface.addConstraint("Products", {
      fields: ["slug"],
      type: "unique",
      name: "products_slug_unique",
    });

    // ===========================
    // INDEX
    // ===========================

    await queryInterface.addIndex("Products", ["category_id"], {
      name: "products_category_idx",
    });

    await queryInterface.addIndex("Products", ["status"], {
      name: "products_status_idx",
    });

    await queryInterface.addIndex("Products", ["is_featured"], {
      name: "products_featured_idx",
    });

    await queryInterface.addIndex("Products", ["is_ready_stock"], {
      name: "products_ready_stock_idx",
    });

    await queryInterface.addIndex("Products", ["createdAt"], {
      name: "products_created_at_idx",
    });

    await queryInterface.addIndex("Products", ["status", "is_featured"], {
      name: "products_status_featured_idx",
    });
    await queryInterface.addIndex("Products", ["view_count"], {
      name: "products_view_count_idx",
    });

    await queryInterface.addIndex("Products", ["sold_count"], {
      name: "products_sold_count_idx",
    });

    await queryInterface.addIndex("Products", ["slug"], {
      name: "products_slug_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Products");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Products_status";',
    );
  },
};
