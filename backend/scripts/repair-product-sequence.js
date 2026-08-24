require("dotenv").config();

const { sequelize } = require("../models");

async function repair() {
  const [rows] = await sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('"Products"', 'id'),
      COALESCE((SELECT MAX("id") FROM "Products"), 1),
      EXISTS(SELECT 1 FROM "Products")
    ) AS repaired_to;
  `);

  console.log(`Sequence Product berhasil diselaraskan ke ID ${rows[0].repaired_to}.`);
}

repair()
  .catch((error) => {
    console.error(`Gagal menyelaraskan sequence Product: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
