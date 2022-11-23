import express from "express";
import {
  createUserHandler,
  loginHandler,
  sendResetPasswordCodeHandler,
  updatePasswordHandler,
} from "./auth.controllers";
//import isAuth from  "../../middlewares/auth.middlewares";

const router = express.Router();

router.get("/", (_, res) => res.send("Hello Auth Route"));

//Create user router
router.post("/register", createUserHandler);

//User sign-in route
router.post("/login", loginHandler);

// send reset link route
router.post("/reset-password", sendResetPasswordCodeHandler);

// verify password reset code and change password
router.post("/update-password", updatePasswordHandler);

//validate user route
//router.get("/me", isAuth, authController.userValidationHandler);

export default router;
