import express from "express";
import { isAuth } from "../../middlewares/auth.middlewares";
import {
  changeProfileHandler,
  meHandler,
  changePasswordHandler,
} from "./users.controllers";

const router = express.Router();

const multer = require("multer");
const fileUpload = multer();

//get user profile
router.get("/me", isAuth, meHandler);

//add / change user profile picture
router.post(
  "/upload",
  isAuth,
  fileUpload.single("avatar"),
  changeProfileHandler,
);

router.post("/change-password", isAuth, changePasswordHandler);

export default router;
