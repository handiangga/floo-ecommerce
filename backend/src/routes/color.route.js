const router = require("express").Router();

const ColorController = require("../controllers/color.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const ColorValidation = require("../validations/color.validation");

router.get("/", ColorController.index);

router.get("/:id", ColorController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ColorValidation.create),
  ColorController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(ColorValidation.update),
  ColorController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  ColorController.destroy,
);

module.exports = router;
