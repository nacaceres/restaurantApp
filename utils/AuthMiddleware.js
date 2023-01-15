/** Middleware functions that intercept incoming request to validate the authentication process.
 * @module utils/AuthMiddleware
 * @requires SecurityFunctions
 */

/**
 * verifyJWT function
 * @const
 */
const { verifyAccessJWT } = require("./SecurityFunctions");

/**
 * Middleware to protect endpoints for authenticated users.
 * The middleware inserts the user info contained in the token into the request. (req.user)
 * @param {object} req - The actual request.
 * @param {object} res - The actul object response.
 * @param {function} next - The callback in case the request was made by a authenticated user.
 */
module.exports.auth = (req, res, next) => {
  let token = req.headers.authorization;
  token = token?.split(" ")[1]?.toString();
  if (token) {
    verifyAccessJWT(token, (err, user) => {
      if (err) {
        res.status(401).send("Unauthorized");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};
