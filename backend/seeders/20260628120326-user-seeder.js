"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const isProduction = process.env.NODE_ENV === "production";
    const ownerPassword = process.env.INITIAL_OWNER_PASSWORD;

    if (isProduction && (!ownerPassword || ownerPassword.length < 12)) {
      throw new Error(
        "INITIAL_OWNER_PASSWORD with at least 12 characters is required for production seeding",
      );
    }

    const users = isProduction
      ? [
          {
            role_id: 1,
            name: process.env.INITIAL_OWNER_NAME || "Floo Owner",
            email: process.env.INITIAL_OWNER_EMAIL || "owner@floofashionn.com",
            phone: process.env.INITIAL_OWNER_PHONE || "",
            password: bcrypt.hashSync(ownerPassword, 12),
            photo: null,
            last_login: null,
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
      : [
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
    ];

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
