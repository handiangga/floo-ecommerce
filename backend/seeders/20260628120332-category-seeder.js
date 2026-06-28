"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Kebaya",
        slug: "kebaya",
        image: null,
        banner: null,
        description: "Kategori Kebaya",
        sort_order: 1,
        is_featured: true,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gamis",
        slug: "gamis",
        image: null,
        banner: null,
        description: "Kategori Gamis",
        sort_order: 2,
        is_featured: true,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Couple",
        slug: "couple",
        image: null,
        banner: null,
        description: "Kategori Couple",
        sort_order: 3,
        is_featured: true,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Big Size",
        slug: "big-size",
        image: null,
        banner: null,
        description: "Kategori Big Size",
        sort_order: 4,
        is_featured: true,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
