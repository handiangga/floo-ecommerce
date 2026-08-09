"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HomepageOccasions", {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      title: { type: Sequelize.STRING(120), allowNull: false },
      image: { type: Sequelize.TEXT, allowNull: false },
      link: { type: Sequelize.TEXT, allowNull: false, defaultValue: "/products" },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM("ACTIVE", "INACTIVE"), allowNull: false, defaultValue: "ACTIVE" },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.bulkInsert("HomepageOccasions", [
      { title: "Lamaran & Engagement", image: "/images/products/1.jpg", link: "/kebaya", sort_order: 1, status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() },
      { title: "Wisuda", image: "/images/products/2.jpg", link: "/new-arrival", sort_order: 2, status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() },
      { title: "Kondangan", image: "/images/products/3.jpg", link: "/products", sort_order: 3, status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() },
      { title: "Couple Moment", image: "/images/products/4.jpg", link: "/couple", sort_order: 4, status: "ACTIVE", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(queryInterface) { await queryInterface.dropTable("HomepageOccasions"); },
};
