/** Express router providing records related routes
 * @module routes/RecordsIndex
 * @requires express
 * @requires IndexFunctions
 * @requires RecordsLogic
 * @requires AuthMiddleware
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
 * IndexFunctions module
 * @const
 */
const IndexFunctions = require("../utils/IndexFunctions");

/**
 * RecordsLogic module
 * @const
 */
const RecordsLogic = require("../logic/RecordsLogic");
/**
 * AuthMiddleware module
 * @const
 */
const AuthMiddleware = require("../utils/AuthMiddleware");

/**
 * Route for retrieve all query records.
 * @name get/
 * @function
 * @memberof module:routes/RecordsIndex~recordsRouter
 * @inner
 * @param {string} path - Express path
 */
router.get("/", AuthMiddleware.auth, function (req, res, next) {
  RecordsLogic.getAllRecords()
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      IndexFunctions.handleError(res, error);
    });
});
module.exports = router;
