"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "subcategory_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "Categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.createTable("Collections", {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      status: { type: Sequelize.ENUM("ACTIVE", "INACTIVE"), allowNull: false, defaultValue: "ACTIVE" },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("ProductCollections", {
      product_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: { model: "Products", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      collection_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: { model: "Collections", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.bulkInsert("Collections", ["Couple", "Big Size", "Premium Collection"].map((name, index) => ({ name, slug: name.toLowerCase().replace(/ /g, "-"), status: "ACTIVE", sort_order: index + 1, createdAt: new Date(), updatedAt: new Date() })));
  },
  async down(queryInterface) {
    await queryInterface.dropTable("ProductCollections");
    await queryInterface.dropTable("Collections");
    await queryInterface.removeColumn("Products", "subcategory_id");
  },
};
