const { User } = require("../../models");
const { uploadImagesToCloud } = require("../../utils/upload.utils");
const { constructError, constructRes } = require("../../utils/network.utils");
const bcrypt = require("bcryptjs");

const changeProfileHandler = async (req, res) => {
  if (!req.file) {
    return constructError(res, 400, "Validation error", "Avatar missing in request body");
  }

  try {
    const response = await uploadImagesToCloud(req.file);

    if (response) {
      const { secure_url } = response;
      const updated = await User.update({ avatarUrl: secure_url }, { where: { userId: req.user.userId } });

      return constructRes(res, 201, updated);
    }
  } catch (err) {
    console.log(err);
    constructError(res);
  }

};

const meHandler = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { attributes: { exclude: ["password"] } });
    if (!user) throw new Error("User does not exit");

    return constructRes(res, 200, user);
  } catch (err) {
    constructError(res, 500, "Internal Server Error", "Please try again later.");
    console.log(err);
  }
};

const changePasswordHandler = async (req, res) => {
  const userId = req.user.userId;

  const { newPassword, oldPassword } = req.body;
  if (!oldPassword) {
    return constructError(res, 400, "Invalid params", "Old password is required");
  }

  if (!newPassword) {
    return constructError(res, 400, "Invalid params", "New password is required");
  }

  try {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return constructError(res, 400, "Bad request", "No user found");
    }

    const matched = await bcrypt.compare(oldPassword, user.password);

    if (!matched) {
      return constructError(res, 400, "Bad request", "Old password incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return constructRes(res, 201, { message: "Password update successfully" });
  } catch (err) {
    constructError(res);
    console.log(err);
  }
};

module.exports = { changeProfileHandler, meHandler, changePasswordHandler };