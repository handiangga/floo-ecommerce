require("dotenv").config();

const usesSsl =
  process.env.DATABASE_SSL === "true" ||
  /supabase\.co/i.test(process.env.DATABASE_URL || "");
const dialectOptions = usesSsl
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },

  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },
};
