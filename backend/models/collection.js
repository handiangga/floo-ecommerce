"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model { static associate(models) { Collection.belongsToMany(models.Product, { through: "ProductCollections", foreignKey: "collection_id", otherKey: "product_id", as: "products" }); } }
  Collection.init({ id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true }, name: { type: DataTypes.STRING(100), allowNull: false, unique: true }, slug: { type: DataTypes.STRING(120), allowNull: false, unique: true }, status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" }, sort_order: { type: DataTypes.INTEGER, defaultValue: 0 } }, { sequelize, modelName: "Collection", tableName: "Collections", timestamps: true });
  return Collection;
};
