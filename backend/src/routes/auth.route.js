const router = require("express").Router();

const AuthController = require("../controllers/auth.controller");

const validation = require("../middlewares/validation");

const authentication = require("../middlewares/authentication");

const AuthValidation = require("../validations/auth.validation");

router.post("/login", validation(AuthValidation.login), AuthController.login);

router.get("/profile", authentication, AuthController.profile);

module.exports = router;
