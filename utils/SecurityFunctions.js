/** Security functions providing JWT and password basic functions
 * @module utils/SecurityFunctions
 * @requires jsonwebtoken
 * @requires bcrypt
 * @requires ConfigConstants
 */
/**
 * jsonwebtoken module
 * @const
 */
const jwt = require("jsonwebtoken");

/**
 * bcrypt module
 * @const
 */
const bcrypt = require("bcrypt");

/**
 * securityConfigs module
 * @const
 */
const { securityConfigs } = require("../constants/ConfigConstants");

/**
 * Create an json web token.
 * @param {object} content - The id of the user.
 * @param {string} secret - The secret to hash de JWT.
 * @param {string} expiration - The expiration time of the jwt.
 * @return {string} A string containing a sign JWT with the specified content, secret and expiration.
 */
module.exports.signJWT = (content, secret, expiration) => {
  return jwt.sign(content, secret, { expiresIn: expiration });
};

/**
 * Verify a access JWT passed by parameter.
 * @param {string} token - The token that is going to be verified.
 * @param {function} callback - The callback when the token is verified, with the parameters: (err, info).
 */
module.exports.verifyAccessJWT = (token, callback) => {
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, callback);
};
/**
 * Verify a refresh JWT passed by parameter.
 * @param {string} token - The token that is going to be verified.
 * @return {object} An object with the jwt content.
 */
module.exports.verifyRefreshJWT = async (token) => {
  return await new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    })
  );
};

/**
 * Encrypts the password passed by parameter.
 * @async
 * @param {string} password - The length of the password.
 * @return {string} A string containing the password encrypted.
 */
module.exports.encryptPassword = async (password) => {
  return await new Promise((resolve, reject) =>
    bcrypt.hash(password, securityConfigs.saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    })
  );
};

/**
 * Check if the plain and hashed passwords passed by parameters are equal.
 * @async
 * @param {string} plain - The plan text password.
 * @param {string} hashed - The hashed password.
 * @return {boolean} A boolean that represents if passwords are equal.
 */
module.exports.comparePasswords = async (plain, hashed) => {
  return await new Promise((resolve, reject) =>
    bcrypt.compare(plain, hashed, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  );
};
