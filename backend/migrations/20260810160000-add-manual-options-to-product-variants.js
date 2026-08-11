"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ProductVariants", "option_values", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.addColumn("ProductVariants", "option_key", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.removeConstraint("ProductVariants", "product_variants_product_color_size_unique");
    await queryInterface.addConstraint("ProductVariants", {
      fields: ["product_id", "option_key"],
      type: "unique",
      name: "product_variants_product_option_key_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("ProductVariants", "product_variants_product_option_key_unique");
    await queryInterface.addConstraint("ProductVariants", {
      fields: ["product_id", "color_id", "size_id"],
      type: "unique",
      name: "product_variants_product_color_size_unique",
    });
    await queryInterface.removeColumn("ProductVariants", "option_key");
    await queryInterface.removeColumn("ProductVariants", "option_values");
  },
};
