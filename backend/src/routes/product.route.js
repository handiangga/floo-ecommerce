const router = require("express").Router();

const ProductController = require("../controllers/product.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const ProductValidation = require("../validations/product.validation");

router.get("/", ProductController.index);

router.get("/slug/:slug", ProductController.showBySlug);

router.get("/:id", ProductController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ProductValidation.create),
  ProductController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ProductValidation.update),
  ProductController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  ProductController.destroy,
);

module.exports = router;
