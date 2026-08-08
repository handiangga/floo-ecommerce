const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const validateEnvironment = require("./config/validate-environment");
const app = require("./app");

const { sequelize } = require("../models");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    validateEnvironment();
    await sequelize.authenticate();

    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();
