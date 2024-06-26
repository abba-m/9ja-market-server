/* eslint-disable */
import { User } from "../../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { constructError, constructRes } from "../../utils/network.utils";
import { userRegistrationEmailObject } from "../../utils/emailTemplates/userReg.email";
import { sendMail, createLogger } from "../../utils/utils";
import { resetPasswordEmail } from "../../utils/emailTemplates/resetPass.email";
import { getResetCodeExpireTime } from "../../utils/utils";
import randNum from "random-number-csprng";

const debug = createLogger("AuthController");

const genAuthToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

export const createUserHandler = async function (req, res) {
  const { email, firstName, lastName, password, phone } = req.body;

  if (!email || !firstName || !lastName || !password)
    return constructError(res, 400, "Bad Request", "All fields are required.");

  try {
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser)
      return constructError(
        res,
        400,
        "Bad Request",
        "User with this email already exists.",
      );

    const user = User.build({
      email,
      phone,
      firstName,
      lastName,
      password,
    });

    const savedUser = await user.save();

    if (savedUser) {
      const { subject, emailText, emailHtml } = userRegistrationEmailObject();
      const sent = await sendMail(
        savedUser.email,
        subject,
        emailText,
        emailHtml,
      );

      if (sent && sent?.body) {
        debug.error(`[Email res]: ${sent?.body}`);
      }
    }

    const userWithoutPassword = await User.findOne({
      where: { userId: savedUser.userId },
      attributes: { exclude: ["password"] },
    });

    const token = genAuthToken(savedUser.userId);

    return constructRes(res, 201, {
      jwt: token,
      user: userWithoutPassword,
    });
  } catch (err) {
    constructError(
      res,
      500,
      "Internal Server Error",
      "Something went wrong. Please try again later.",
    );
    debug.error(err);
  }
};

export const loginHandler = async function (req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: "Identifier and Password are required.",
    });

  try {
    const user = await User.findOne({
      where: { email: identifier },
    });

    if (!user)
      return constructError(
        res,
        400,
        "Bad Request",
        "Invalid Identifier or password.",
      );

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return constructError(
        res,
        400,
        "Bad Request",
        "Invalid Identifier or password.",
      );

    const userWithoutPassword = await User.findOne({
      where: { userId: user.userId },
      attributes: { exclude: ["password"] },
    });

    const token = genAuthToken(user.userId);

    return constructRes(res, 200, {
      jwt: token,
      user: userWithoutPassword,
    });
  } catch (err) {
    constructError(
      res,
      500,
      "Internal Server Error",
      "Something went wrong. Please try again later.",
    );
    debug.error(err);
  }
};

export const userValidationHandler = async function (req, res) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) throw new Error("User does not exit");

    return constructRes(res, 200, user);
  } catch (err) {
    constructError(
      res,
      500,
      "Internal Server Error",
      "Please try again later.",
    );
    debug.error(err);
  }
};

export const sendResetPasswordCodeHandler = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return constructError(res, 400, "Bad request", "Email not provided");

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return constructError(
      res,
      400,
      "Bad request",
      "A user with this email does not exist",
    );
  }

  //generate reset code { exps after 5 mins }
  const codeExpiresIn = getResetCodeExpireTime();

  try {
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
      return constructRes(res, 200, {
        message: "Password reset code has been sent to your email.",
      });
    } else {
      return constructError(res);
    }
  } catch (err) {
    debug.error(err);
    constructError(res);
  }
};

export const updatePasswordHandler = async (req, res) => {
  const { resetCode, password } = req.body;

  if (!resetCode) {
    return constructError(res, 400, "Bad request", "Reset code not provided");
  }

  if (!password) {
    return constructError(res, 400, "Bad request", "Password not provided");
  }

  const user = await User.findOne({
    where: {
      passwordResetCode: resetCode,
    },
  });

  if (!user) {
    return constructError(res, 400, "Bad request", "Invalid reset code");
  }

  const codeExpirationtime = new Date(user.expiresIn);

  debug.error({ codeExpirationtime });

  if (codeExpirationtime < new Date()) {
    user.passwordResetCode = null;
    user.expiresIn = null;

    await user.save();

    return constructError(res, 400, "Bad request", "Reset code expired");
  }

  try {
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetCode = null;
    user.expiresIn = null;

    await user.save();

    return constructRes(res, 201, {
      message: "Password updated successfully",
    });
  } catch (err) {
    debug.error(err);
    constructError(res);
  }
};
