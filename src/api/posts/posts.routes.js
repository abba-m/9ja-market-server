const express = require("express");
const router = express.Router();
const isAuth = require("../../middlewares/auth.middlewares");

const multer = require("multer");
const fileUpload = multer();
// const fileUpload = multer({ dest: "public/uploads/" });

const PostController = require("./posts.controllers");

router.get("/", PostController.getAllPosts);

router.get("/me", isAuth, PostController.getPostByMe);

//get posts of user
router.get("/user/:id", PostController.getPostOfUserById);

//get post by slug
router.get("/:slug", PostController.getPostBySlug);


/** POST REQS */

// create post
router.post("/", isAuth, fileUpload.array("images", 12), PostController.createPostHandler);

/** DELETE REQS */

// delete post
router.delete("/:id", isAuth, PostController.deletePost);

/** PUT REQS */

// edit post
router.put("/:id", isAuth, PostController.editPost);

module.exports = router;