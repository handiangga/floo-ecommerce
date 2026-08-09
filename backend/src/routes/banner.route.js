const router = require("express").Router();

const BannerController = require("../controllers/banner.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const BannerValidation = require("../validations/banner.validation");
const upload = require("../middlewares/upload");

router.get("/", BannerController.index);

router.get("/:id", BannerController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  upload.single("image_file"),
  validation(BannerValidation.create),
  BannerController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  upload.single("image_file"),
  validation(BannerValidation.update),
  BannerController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  BannerController.destroy,
);

module.exports = router;
