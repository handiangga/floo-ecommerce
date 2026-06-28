"use strict";

const VoucherType = require("../src/constants/voucherType");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Vouchers", [
      {
        code: "WELCOME10",
        name: "Welcome Voucher",
        type: VoucherType.PERCENTAGE,
        value: 10,
        min_purchase: 200000,
        max_discount: 50000,
        quota: 1000,
        used: 0,
        start_date: new Date(),
        end_date: new Date("2027-12-31"),
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "HEMAT50K",
        name: "Potongan 50K",
        type: VoucherType.FIXED,
        value: 50000,
        min_purchase: 500000,
        max_discount: 50000,
        quota: 500,
        used: 0,
        start_date: new Date(),
        end_date: new Date("2027-12-31"),
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "FREESHIP",
        name: "Gratis Ongkir",
        type: VoucherType.FIXED,
        value: 30000,
        min_purchase: 150000,
        max_discount: 30000,
        quota: 1000,
        used: 0,
        start_date: new Date(),
        end_date: new Date("2027-12-31"),
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Vouchers", null, {});
  },
};
