"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreSetting extends Model {}
  StoreSetting.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
      store_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "Floo Fashionn",
      },
      sender_name: { type: DataTypes.STRING(100), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      email: { type: DataTypes.STRING(120), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      province: { type: DataTypes.STRING(100), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
      district: { type: DataTypes.STRING(100), allowNull: true },
      subdistrict: { type: DataTypes.STRING(100), allowNull: true },
      postal_code: { type: DataTypes.STRING(10), allowNull: true },
      courier_jne: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_jnt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_sicepat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courier_anteraja: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "StoreSetting",
      tableName: "StoreSettings",
      timestamps: true,
    },
  );
  return StoreSetting;
};
