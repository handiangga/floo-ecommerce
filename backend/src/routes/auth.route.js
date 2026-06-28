const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");

const authentication = require("../middlewares/authentication");
const validation = require("../middlewares/validation");

const AuthValidation = require("../validations/auth.validation");

router.post("/login", validation(AuthValidation.login), AuthController.login);

router.get("/profile", authentication, AuthController.profile);

router.post("/logout", authentication, AuthController.logout);

module.exports = router;
