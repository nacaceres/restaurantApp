/** Express router providing all related routes
 * @module routes/index
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require("express");

/**
 * Express router to mount all related functions on.
 * @type {object}
 * @const
 * @namespace usersRouter
 */
const router = express.Router();

/**
 * Route serving /auth routes.
 * @param {string} path - Express path
 * @param {module} module - Express router.
 */
router.use("/auth", require("./AuthIndex"));

/**
 * Route serving /restaurants routes.
 * @param {string} path - Express path
 * @param {module} module - Express router.
 */
router.use("/restaurants", require("./RestaurantsIndex"));

/**
 * Route serving /records routes.
 * @param {string} path - Express path
 * @param {module} module - Express router.
 */
router.use("/records", require("./RecordsIndex"));

module.exports = router;
