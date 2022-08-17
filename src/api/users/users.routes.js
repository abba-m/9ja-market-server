const express = require("express");
const router = express.Router();
const isAuth = require("../../middlewares/auth.middlewares");
const { changeProfileHandler, meHandler, changePasswordHandler } = require("./users.controllers");

const multer = require("multer");
const fileUpload = multer();

//get user profile
router.get("/me", isAuth, meHandler);

//add / change user profile picture
router.post("/upload", isAuth, fileUpload.single("avatar"), changeProfileHandler);

router.post("/change-password", isAuth, changePasswordHandler);

module.exports = router;