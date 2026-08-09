"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('ALTER TABLE "Categories" DROP CONSTRAINT IF EXISTS "Categories_name_key";');
    await queryInterface.sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS "categories_root_name_unique" ON "Categories" (LOWER("name")) WHERE "parent_id" IS NULL;');
    await queryInterface.sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS "categories_child_name_per_parent_unique" ON "Categories" ("parent_id", LOWER("name")) WHERE "parent_id" IS NOT NULL;');
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "categories_child_name_per_parent_unique";');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS "categories_root_name_unique";');
    await queryInterface.addConstraint("Categories", { fields: ["name"], type: "unique", name: "Categories_name_key" });
  },
};
