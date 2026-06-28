require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================
// HEALTH CHECK
// ======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Floo Ecommerce API",
    version: "1.0.0",
  });
});

// ======================
// API
// ======================

app.use("/api/v1", routes);

// ======================
// 404
// ======================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint Not Found",
  });
});

// ======================
// ERROR HANDLER
// ======================

app.use(errorHandler);

module.exports = app;
