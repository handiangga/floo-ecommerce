"use strict";

const oldTitle = "Luxury Crafted with Heart";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate("HomepageCraftsmanships", {
      title: "Crafted with Care, Made to Be Remembered.",
      description: "Setiap koleksi Floo Fashion hadir dari pemilihan material, detail yang dikerjakan dengan teliti, hingga siluet yang dirancang untuk membuat setiap perempuan tampil istimewa.",
      button_label: "Discover Our Story",
      features: JSON.stringify([
        { title: "Premium Material", description: "Material pilihan berkualitas" },
        { title: "Thoughtful Details", description: "Detail dikerjakan dengan teliti" },
        { title: "Exclusive Design", description: "Desain khas Floo Fashion" },
        { title: "Loved by Customers", description: "Dipercaya 100K+ customer" },
      ]),
      updatedAt: new Date(),
    }, { title: oldTitle });
  },
  async down(queryInterface) {
    await queryInterface.bulkUpdate("HomepageCraftsmanships", { title: oldTitle, updatedAt: new Date() }, { title: "Crafted with Care, Made to Be Remembered." });
  },
};
