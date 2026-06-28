"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Colors", [
      {
        name: "Maroon",
        code: "#800000",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Navy",
        code: "#001F54",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Black",
        code: "#000000",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cream",
        code: "#F5F5DC",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mocca",
        code: "#967969",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dusty Pink",
        code: "#D8A7B1",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sage",
        code: "#9CAF88",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Olive",
        code: "#708238",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Silver",
        code: "#C0C0C0",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gold",
        code: "#D4AF37",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Colors", null, {});
  },
};
