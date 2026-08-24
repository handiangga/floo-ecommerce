require("dotenv").config();

const { sequelize } = require("../models");

const tables = ["ProductVariants", "Colors", "Sizes"];

async function repair() {
  for (const table of tables) {
    const [rows] = await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('"${table}"', 'id'),
        COALESCE((SELECT MAX("id") FROM "${table}"), 1),
        EXISTS(SELECT 1 FROM "${table}")
      ) AS repaired_to;
    `);

    console.log(`Sequence ${table} berhasil diselaraskan ke ID ${rows[0].repaired_to}.`);
  }
}

repair()
  .catch((error) => {
    console.error(`Gagal menyelaraskan sequence variasi: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
