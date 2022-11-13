const { Post } = require("../../models");
const { rpcServer } = require("../../services/rpcServer");

// Remove on server and client
const getUserPostsCount = async (_, { user = {} }) => {
  const count = await Post.count({
    where: { userId: user.userId }
  });

  return { count };
};

const editPost = async ({ postId, data }, { user = {} }) => {

  delete data?.images;
  const { userId } = user;

  if (!userId) throw new Error("Access denied");

  await Post.update(data, {
    where: { userId, postId }
  });

  return { success: true };
};

const deletePost = async ({ postId }, { user = {} }) => {
  if (user.userId) throw new Error("Access denied");

  try {
    await Post.destroy({
      where: { postId, userId: user.userId }
    });

    return { success: true };
  } catch (err) {
    console.log("[Error deleting post]:", err);
  }
};

const getPostOfUserById = async ({ userId }) => {
  if (!userId) throw new Error("UserId is undefined");

  return Post.findAll({ where: { userId } });
};

const getLatestPosts = async () => {
  return Post.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
};


rpcServer.addMethod("getUserPostsCount", getUserPostsCount);
rpcServer.addMethod("editPost", editPost);
rpcServer.addMethod("deletePost", deletePost);
rpcServer.addMethod("getPostOfUserById", getPostOfUserById);
rpcServer.addMethod("getLatestPosts", getLatestPosts);
