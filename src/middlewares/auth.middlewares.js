import jwt from "jsonwebtoken";
import { constructError } from "../utils/network.utils";

export const isAuth = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return constructError(res, 401, "Please login and try again", "");

  try {
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET,
    );
    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
