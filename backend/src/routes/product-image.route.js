"use strict";

const router = require("express").Router();

const ProductImageController = require("../controllers/product-image.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");
const upload = require("../middlewares/upload");

const ProductImageValidation = require("../validations/product-image.validation");

router.get("/:productId", ProductImageController.index);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  upload.array("images", 10),
  validation(ProductImageValidation.create),
  ProductImageController.store,
);

router.put(
  "/product/:productId/reorder",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ProductImageValidation.reorder),
  ProductImageController.reorder,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  ProductImageController.destroy,
);

module.exports = router;
