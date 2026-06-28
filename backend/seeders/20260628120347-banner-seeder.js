"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Banners", [
      {
        title: "New Arrival Kebaya",
        image: "https://placehold.co/1200x500?text=Banner+1",
        link: "/products/new-arrival",
        sort_order: 1,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Big Size Collection",
        image: "https://placehold.co/1200x500?text=Banner+2",
        link: "/categories/big-size",
        sort_order: 2,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Best Seller",
        image: "https://placehold.co/1200x500?text=Banner+3",
        link: "/products/best-seller",
        sort_order: 3,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Banners", null, {});
  },
};