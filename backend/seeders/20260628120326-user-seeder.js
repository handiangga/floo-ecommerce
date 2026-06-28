"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        role_id: 1,
        name: "Owner",
        email: "owner@floo.id",
        phone: "081111111111",
        password: bcrypt.hashSync("123456", 10),
        photo: null,
        last_login: null,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 2,
        name: "Admin",
        email: "admin@floo.id",
        phone: "082222222222",
        password: bcrypt.hashSync("123456", 10),
        photo: null,
        last_login: null,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 3,
        name: "Customer Service",
        email: "cs@floo.id",
        phone: "083333333333",
        password: bcrypt.hashSync("123456", 10),
        photo: null,
        last_login: null,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
