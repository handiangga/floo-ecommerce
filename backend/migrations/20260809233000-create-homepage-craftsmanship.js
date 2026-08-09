"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HomepageCraftsmanships", {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      eyebrow: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "Our Craftsmanship" },
      title: { type: Sequelize.STRING(160), allowNull: false, defaultValue: "Luxury Crafted with Heart" },
      description: { type: Sequelize.TEXT, allowNull: false },
      button_label: { type: Sequelize.STRING(60), allowNull: false, defaultValue: "Our Story" },
      button_link: { type: Sequelize.STRING(255), allowNull: false, defaultValue: "/products" },
      features: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      images: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.bulkInsert("HomepageCraftsmanships", [{
      eyebrow: "Our Craftsmanship",
      title: "Luxury Crafted with Heart",
      description: "Setiap kebaya Floo Fashion dibuat dengan ketelitian tinggi, menggunakan material premium dan sentuhan tangan ahli.",
      button_label: "Our Story",
      button_link: "/products",
      features: JSON.stringify([
        { title: "Premium Quality", description: "Material Pilihan Terbaik" },
        { title: "Detail Handmade", description: "Dikerjakan dengan Teliti" },
        { title: "Exclusive Design", description: "Desain Eksklusif & Elegan" },
        { title: "Trusted Brand", description: "Dipercaya 100K+ Customer" },
      ]),
      images: JSON.stringify(["/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg", "/images/products/6.jpg"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  async down(queryInterface) { await queryInterface.dropTable("HomepageCraftsmanships"); },
};
