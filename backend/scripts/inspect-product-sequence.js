require("dotenv").config();

console.log("Memeriksa sequence produk...");

const { sequelize } = require("../models");

async function inspect() {
  console.log("Menjalankan query metadata...");
  const [tables] = await sequelize.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename ILIKE '%product%'
    ORDER BY tablename;
  `);
  console.log("Metadata tabel diterima.");
  const [rows] = await sequelize.query(`
    SELECT
      c.conrelid::regclass::text AS table_name,
      c.conname AS constraint_name,
      pg_get_serial_sequence(c.conrelid::regclass::text, 'id') AS sequence_name,
      pg_get_serial_sequence('"Products"', 'id') AS configured_sequence,
      (SELECT MAX("id") FROM "Products") AS max_product_id
    FROM pg_constraint c
    WHERE c.conrelid = '"Products"'::regclass;
  `);

  const [sequence] = await sequelize.query('SELECT last_value, is_called FROM "Products_id_seq";');
  console.log(JSON.stringify({ tables, primaryKeys: rows, sequence }, null, 2));
}

async function main() {
  try {
    await inspect();
  } catch (error) {
    process.stdout.write(`Gagal memeriksa database: ${JSON.stringify({ name: error.name, message: error.message, code: error.code, parent: error.parent && { message: error.parent.message, code: error.parent.code } })}\n`);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
