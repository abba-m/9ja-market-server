const express = require("express");
const router = express.Router();
const AuthController = require("./auth.controllers");
//const isAuth = require("../../middlewares/auth.middlewares");

router.get("/", (_, res) => res.send("Hello Auth Route"));

//Create user router
router.post("/register", AuthController.createUserHandler);

//User sign-in route
router.post("/login", AuthController.loginHandler);

// send reset link route
router.post("/reset-password", AuthController.sendResetPasswordCodeHandler);

// verify password reset code and change password
router.post("/update-password", AuthController.updatePasswordHandler);

//validate user route
//router.get("/me", isAuth, authController.userValidationHandler);

module.exports = router;
