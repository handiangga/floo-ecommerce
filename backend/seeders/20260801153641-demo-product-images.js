"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("ProductImages", [
      // ==========================
      // PRODUCT 1
      // ==========================
      {
        product_id: 1,
        color_id: null,
        image: "https://picsum.photos/id/1011/800/1000",
        alt: "Kebaya Kirana Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        product_id: 1,
        color_id: null,
        image: "https://picsum.photos/id/1016/800/1000",
        alt: "Kebaya Kirana Premium Back",
        is_primary: false,
        sort_order: 2,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 2
      // ==========================
      {
        product_id: 2,
        color_id: null,
        image: "https://picsum.photos/id/1012/800/1000",
        alt: "Kebaya Ayana Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 3
      // ==========================
      {
        product_id: 3,
        color_id: null,
        image: "https://picsum.photos/id/1013/800/1000",
        alt: "Kebaya Lavina Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 4
      // ==========================
      {
        product_id: 4,
        color_id: null,
        image: "https://picsum.photos/id/1015/800/1000",
        alt: "Kebaya Jasmine Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 5
      // ==========================
      {
        product_id: 5,
        color_id: null,
        image: "https://picsum.photos/id/1016/800/1000",
        alt: "Kebaya Amora Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 6
      // ==========================
      {
        product_id: 6,
        color_id: null,
        image: "https://picsum.photos/id/1018/800/1000",
        alt: "Kebaya Aurelia Premium",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 7
      // ==========================
      {
        product_id: 7,
        color_id: null,
        image: "https://picsum.photos/id/1020/800/1000",
        alt: "Kebaya Naira",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 8
      // ==========================
      {
        product_id: 8,
        color_id: null,
        image: "https://picsum.photos/id/1024/800/1000",
        alt: "Kebaya Elora",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 9
      // ==========================
      {
        product_id: 9,
        color_id: null,
        image: "https://picsum.photos/id/1025/800/1000",
        alt: "Kebaya Safira",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 10
      // ==========================
      {
        product_id: 10,
        color_id: null,
        image: "https://picsum.photos/id/1027/800/1000",
        alt: "Kebaya Aluna",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 11
      // ==========================
      {
        product_id: 11,
        color_id: null,
        image: "https://picsum.photos/id/1031/800/1000",
        alt: "Kebaya Nayara",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },

      // ==========================
      // PRODUCT 12
      // ==========================
      {
        product_id: 12,
        color_id: null,
        image: "https://picsum.photos/id/1033/800/1000",
        alt: "Kebaya Keisha",
        is_primary: true,
        sort_order: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ProductImages", null, {});
  },
};
