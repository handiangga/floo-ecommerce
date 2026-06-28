"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Roles", [
      {
        name: "OWNER",
        description: "System Owner",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ADMIN",
        description: "Administrator",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "CUSTOMER_SERVICE",
        description: "Customer Service",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
