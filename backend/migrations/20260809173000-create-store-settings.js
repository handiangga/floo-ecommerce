"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StoreSettings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: 1,
      },
      store_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
        defaultValue: "Floo Fashionn",
      },
      sender_name: { type: Sequelize.STRING(100), allowNull: true },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      email: { type: Sequelize.STRING(120), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      province: { type: Sequelize.STRING(100), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      district: { type: Sequelize.STRING(100), allowNull: true },
      subdistrict: { type: Sequelize.STRING(100), allowNull: true },
      postal_code: { type: Sequelize.STRING(10), allowNull: true },
      courier_jne: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_jnt: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_sicepat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_anteraja: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable("StoreSettings");
  },
};
