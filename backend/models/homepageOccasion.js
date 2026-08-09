"use strict";

const { Model } = require("sequelize");
const OCCASION_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };

module.exports = (sequelize, DataTypes) => {
  class HomepageOccasion extends Model {}

  HomepageOccasion.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(120), allowNull: false, validate: { notEmpty: true } },
      image: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "/products",
        validate: {
          isInternalPathOrUrl(value) {
            if (value && value.startsWith("/")) return;
            try { new URL(value); } catch { throw new Error("Link must be a valid URL or internal path"); }
          },
        },
      },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM(OCCASION_STATUS.ACTIVE, OCCASION_STATUS.INACTIVE),
        allowNull: false,
        defaultValue: OCCASION_STATUS.ACTIVE,
      },
    },
    { sequelize, modelName: "HomepageOccasion", tableName: "HomepageOccasions", timestamps: true },
  );

  return HomepageOccasion;
};
