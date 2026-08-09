"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HomepageCraftsmanship extends Model {}

  HomepageCraftsmanship.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    eyebrow: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Our Craftsmanship" },
    title: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    button_label: { type: DataTypes.STRING(60), allowNull: false, defaultValue: "Our Story" },
    button_link: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "/products" },
    features: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    images: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    gallery: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  }, { sequelize, modelName: "HomepageCraftsmanship", tableName: "HomepageCraftsmanships", timestamps: true });

  return HomepageCraftsmanship;
};
