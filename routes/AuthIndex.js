/** Express router providing auth related routes
 * @module routes/AuthIndex
 * @requires express
 * @requires Joi
 * @requires Joi-password
 * @requires IndexFunctions
 * @requires AuthLogic
 */

/**
 * express module
 * @const
 */
const express = require("express");

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router();

/**
 * Joi module
 * @const
 */
const Joi = require("joi");

/**
 * Joi joiPasswordExtendCore module
 * @const
 */
const { joiPasswordExtendCore } = require("joi-password");
/**
 * Joi joiPassword
 * @const
 */
const joiPassword = Joi.extend(joiPasswordExtendCore);

/**
 * IndexFunctions module
 * @const
 */
const IndexFunctions = require("../utils/IndexFunctions");

/**
 * AuthLogic module
 * @const
 */
const AuthLogic = require("../logic/AuthLogic");

/**
 * Joi schema with the structure of a registration
 * @const
 */
const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: joiPassword
    .string()
    .min(8)
    .required()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .messages({
      "password.minOfUppercase":
        "{#label} should contain at least {#min} uppercase character",
      "password.minOfSpecialCharacters":
        "{#label} should contain at least {#min} special character",
      "password.minOfLowercase":
        "{#label} should contain at least {#min} lowercase character",
      "password.minOfNumeric":
        "{#label} should contain at least {#min} numeric character",
      "password.noWhiteSpaces": "{#label} should not contain white spaces",
    }),
});
/**
 * Route serving the registration of an user.
 * @name post/registration
 * @function
 * @memberof module:routes/AuthIndex~authRouter
 * @inner
 * @param {string} path - Express path
 */
router.post(
  "/registration",
  IndexFunctions.validateSchema(registrationSchema, "body"),
  function (req, res, next) {
    AuthLogic.createUser(req.body.name, req.body.email, req.body.password)
      .then(() => res.status(201).send())
      .catch((error) => {
        IndexFunctions.handleError(res, error);
      });
  }
);
/**
 * Joi schema with the structure of a login request
 * @const
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
/**
 * Route serving the login for an user.
 * @name post/login
 * @function
 * @memberof module:routes/AuthIndex~authRouter
 * @inner
 * @param {string} path - Express path
 */
router.post(
  "/login",
  IndexFunctions.validateSchema(loginSchema, "body"),
  function (req, res, next) {
    AuthLogic.login(req.body.email, req.body.password)
      .then((data) => res.status(200).send(data))
      .catch((error) => {
        IndexFunctions.handleError(res, error);
      });
  }
);
/**
 * Route for generating an access token from a refresh token.
 * @name post/accesstoken
 * @function
 * @memberof module:routes/AuthIndex~authRouter
 * @inner
 * @param {string} path - Express path
 */
router.post("/accesstoken", function (req, res, next) {
  let refreshToken = req.headers.authorization;
  refreshToken = refreshToken?.split(" ")[1]?.toString();
  AuthLogic.createAccessToken(refreshToken)
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      IndexFunctions.handleError(res, error);
    });
});
/**
 * Route for the logout for an user.
 * @name post/logout
 * @function
 * @memberof module:routes/AuthIndex~authRouter
 * @inner
 * @param {string} path - Express path
 */
router.post("/logout", function (req, res, next) {
  let refreshToken = req.headers.authorization;
  refreshToken = refreshToken?.split(" ")[1]?.toString();
  AuthLogic.logout(refreshToken)
    .then(() => res.status(200).send())
    .catch((error) => {
      IndexFunctions.handleError(res, error);
    });
});
module.exports = router;
