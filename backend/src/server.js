require("dotenv").config();

const app = require("./app");

const { sequelize } = require("../models");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();

    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();
