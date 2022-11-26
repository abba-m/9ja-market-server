import { User, UserAddress } from "../../models";
import bcrypt from "bcryptjs";
import { sendMail, createLogger } from "../../utils/utils";
import { resetPasswordEmail } from "../../utils/emailTemplates/resetPass.email";
import { getResetCodeExpireTime } from "../../utils/utils";
import randNum from "random-number-csprng";
import { rpcServer } from "../../services/rpcServer";

const debug = createLogger("AuthRPC");

const getPasswordResetCodeHandler = async ({ email }) => {
  try {
    if (!email) throw new Error("Email not provided");
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("A user with this email does not exist");

    //generate reset code { exps after 5 mins }
    const codeExpiresIn = getResetCodeExpireTime();

    const randd = await randNum(125436, 998754);
    user.passwordResetCode = randd;
    user.expiresIn = codeExpiresIn;
    await user.save();

    const { subject, emailText, emailHtml } = resetPasswordEmail(
      user.lastName,
      randd,
    );
    const sent = await sendMail(user.email, subject, emailText, emailHtml);

    if (sent) {
      return {
        message: "Password reset code has been sent to your email.",
      };
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    debug.error(err);
    throw err;
  }
};

const resetPasswordHandler = async ({ resetCode, password }) => {
  if (!resetCode || !password)
    throw new Error("Reset code or password not provided");

  const user = await User.findOne({
    where: {
      passwordResetCode: resetCode,
    },
  });

  if (!user) throw new Error("Invalid reset code");

  const codeExpirationtime = new Date(user.expiresIn);

  debug.error({ codeExpirationtime });

  if (codeExpirationtime < new Date()) {
    user.passwordResetCode = null;
    user.expiresIn = null;

    await user.save();

    throw new Error("Reset code expired");
  }

  try {
    user.password = password;
    user.passwordResetCode = null;
    user.expiresIn = null;

    await user.save();

    return { success: true };
  } catch (err) {
    debug.error(err);
    throw err;
  }
};

const getUserById = async ({ userId }) => {
  if (!userId) return null;

  return User.findOne({
    where: { userId },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: UserAddress,
        foreignKey: "userId",
      },
    ],
  });
};

/**Change Password */
const changePassword = async ({ password, newPassword }, { user }) => {
  const userId = user?.userId;
  const response = {
    success: false,
    message: "",
    error: null,
  };

  if (!userId) {
    response.message = "Please login and try again";
    return response;
  }

  if (!password || !newPassword) {
    response.message = "Old and New password must be provided";
    return response;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) throw "User not found";

    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      response.message = "Incorrect password.";
      return response;
    }

    user.password = newPassword;
    await user.save();

    response.success = true;
    response.message = "Password updated";

    return response;
  } catch (err) {
    debug.error({ err });
    response.error = err.toJSON();
    return response;
  }
};

rpcServer.addMethod("getPasswordResetCode", getPasswordResetCodeHandler);
rpcServer.addMethod("resetPassword", resetPasswordHandler);
rpcServer.addMethod("getUserById", getUserById);
rpcServer.addMethod("changePassword", changePassword);
