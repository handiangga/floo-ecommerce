const router = require("express").Router();
const controller = require("../controllers/store-setting.controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
router.get(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  controller.show,
);
router.put(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  controller.update,
);
module.exports = router;
