const router = require("express").Router();

const CategoryController = require("../controllers/category.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const CategoryValidation = require("../validations/category.validation");

// Public
router.get("/", CategoryController.index);

router.get("/:id", CategoryController.show);

// Admin
router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(CategoryValidation.create),
  CategoryController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(CategoryValidation.update),
  CategoryController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  CategoryController.destroy,
);

module.exports = router;
