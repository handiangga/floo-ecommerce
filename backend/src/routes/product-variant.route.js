const router = require("express").Router();

const ProductVariantController = require("../controllers/product-variant.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const ProductVariantValidation = require("../validations/product-variant.validation");

router.get("/", ProductVariantController.index);

router.get("/product/:productId", ProductVariantController.showByProduct);

router.get("/:id", ProductVariantController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ProductVariantValidation.create),
  ProductVariantController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ProductVariantValidation.update),
  ProductVariantController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  ProductVariantController.destroy,
);

module.exports = router;
