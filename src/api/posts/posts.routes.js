const express = require("express");
const router = express.Router();
const isAuth = require("../../middlewares/auth.middlewares");

const multer = require("multer");
const fileUpload = multer();
// const fileUpload = multer({ dest: "public/uploads/" });

const PostController = require("./posts.controllers");

router.get("/", PostController.getAllPosts);

router.get("/me", isAuth, PostController.getPostByMe);

//get post by userId
router.get("/user/:id", PostController.getPostOfUserById);

router.delete("/d/:id", isAuth, PostController.deletePostById);

//get post by slug
router.get("/:slug", PostController.getPostBySlug);

router.post("/", isAuth, fileUpload.array("images", 12), PostController.createPostHandler);

router.put("/u/:id", isAuth, PostController.editPostById);

module.exports = router;