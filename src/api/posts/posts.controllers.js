const { Post } = require("../../models");
const { User } = require("../../models/user");

const { constructRes, constructError } = require("../../utils/network.utils");
const { uploadImagesToCloud } = require("../../utils/upload.utils");
const { validatePostReq, createPostSlug } = require("../../utils/posts.util");



//get all post
exports.getAllPosts = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const post = await Post.findAll({ 
    include: [{ model: User, foreignKey: "userId" }], 
    limit, 
    offset: (page - 1) * limit 
  });

  return constructRes(res, 200, post);
};

//create post
exports.createPostHandler = async (req, res) => {
  const validationMessage = validatePostReq(req);

  if (validationMessage !== 0) {
    constructError(res, 400, "Validation Error", validationMessage);
  }

  try {
    const data = JSON.parse(req.body.data);
    data.userId = req.user.userId;
    data.slug = createPostSlug(data.title);
    const result = await uploadImagesToCloud(req.files);

    if (result) {
      const imageUrls = result.map(obj => obj.secure_url);
      data.images = imageUrls.join(",");
    }

    const savedPost = await Post.create(data);

    if (savedPost) {
      return constructRes(res, 201, savedPost);
    }

  } catch (err) {
    constructError(res);
    console.log(err);
  }

};

exports.getPostBySlug = async (req, res) => {
  const slug = req.params.slug;

  try {
    const post = await Post.findOne({
      where: { slug },
      include: [{
        model: User,
        foreignKey: "userId"
      }]
    });
    return constructRes(res, 200, post);

  } catch (err) {
    constructError(res);
    console.log(err);
  }
};

exports.getPostByMe = async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { userId: req.user.userId } });

    return constructRes(res, 200, posts);
  } catch (err) {
    console.log(err);
    constructError(res);
  }
};

exports.getPostOfUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await Post.findAll({ where: { userId } });

    return constructRes(res, 200, posts);
  } catch (err) {
    constructError(res);
    console.log(err);
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.destroy({ 
      where: { postId, userId: req.user?.userId }
    });

    constructRes(res, 204, { success: true });
  } catch (err) {
    constructError(res);
    console.log("[Error deleting post]:", err);
  }
};

exports.editPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user?.userId;
  const data = req.body;

  try {
    delete data?.images;

    await Post.update(data, {
      where: { userId, postId }
    });

    const post = await Post.findOne({ where: { postId } });

    constructRes(res, 200, post);
  } catch (err) {
    constructError(res);
    console.log(err);
  }
};