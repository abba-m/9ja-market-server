const jwt = require("jsonwebtoken");
const { constructError } = require("../utils/network.utils");

function isAuth(req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return constructError(res, 401, "Unauthorized", "Invalid token.");

  try {
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = isAuth;
