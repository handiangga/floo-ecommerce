"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("HomepageCraftsmanships", "gallery", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [
        { title: "Detail Payet", description: "Bordir dan payet dikerjakan satu per satu dengan presisi." },
        { title: "Bahan Premium", description: "Kain pilihan dengan tekstur mewah dan nyaman dipakai." },
        { title: "Handmade Process", description: "Setiap jahitan dibuat dengan ketelitian oleh tangan ahli." },
        { title: "Timeless Elegance", description: "Hasil akhir yang anggun untuk momen berharga Anda." },
      ],
    });
  },
  async down(queryInterface) { await queryInterface.removeColumn("HomepageCraftsmanships", "gallery"); },
};
