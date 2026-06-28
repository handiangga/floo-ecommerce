const router = require("express").Router();

const SizeController = require("../controllers/size.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const SizeValidation = require("../validations/size.validation");

router.get("/", SizeController.index);

router.get("/:id", SizeController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(SizeValidation.create),
  SizeController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(SizeValidation.update),
  SizeController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  SizeController.destroy,
);

module.exports = router;
