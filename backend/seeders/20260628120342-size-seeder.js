"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Sizes", [
      {
        name: "XS",
        sort_order: 1,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "S",
        sort_order: 2,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "M",
        sort_order: 3,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "L",
        sort_order: 4,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "XL",
        sort_order: 5,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "XXL",
        sort_order: 6,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "3XL",
        sort_order: 7,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "4XL",
        sort_order: 8,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "5XL",
        sort_order: 9,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Sizes", null, {});
  },
};
