const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Floo Ecommerce API",
  });
});

module.exports = app;
