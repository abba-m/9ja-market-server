import express from "express";
import { isAuth } from "../../middlewares/auth.middlewares";

const router = express.Router();

const multer = require("multer");
const fileUpload = multer();
// const fileUpload = multer({ dest: "public/uploads/" });

const PostController = require("./posts.controllers");

router.get("/", PostController.getAllPosts);

router.get("/me", isAuth, PostController.getPostByMe);

router.post("/test", (_, res) => {
  res.json({ postTest: "success" });
});

//get posts of user
router.get("/user/:id", PostController.getPostOfUserById);

//get post by slug
router.get("/:slug", PostController.getPostBySlug);

/** POST REQS */

// create post
router.post(
  "/",
  isAuth,
  fileUpload.array("images", 12),
  PostController.createPostHandler,
);

/** DELETE REQS */

// delete post
router.delete("/:id", isAuth, PostController.deletePost);

/** PUT REQS */

// edit post
router.put("/:id", isAuth, PostController.editPost);

export default router;
