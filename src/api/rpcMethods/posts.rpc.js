const { Post } = require("../../models");
const { rpcServer } = require("../../services/rpcServer");


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

rpcServer.addMethod("getUserPostsCount", getUserPostsCount);
rpcServer.addMethod("editPost", editPost);
rpcServer.addMethod("deletePost", deletePost);
