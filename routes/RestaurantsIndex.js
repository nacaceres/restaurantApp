/** Express router providing restaurants related routes
 * @module routes/RestaurantsIndex
 * @requires express
 * @requires Joi
 * @requires IndexFunctions
 * @requires RestaurantsLogic
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
 * Joi module
 * @const
 */
const Joi = require("joi");

/**
 * IndexFunctions module
 * @const
 */
const IndexFunctions = require("../utils/IndexFunctions");

/**
 * RestaurantsLogic module
 * @const
 */
const RestaurantsLogic = require("../logic/RestaurantsLogic");
/**
 * AuthMiddleware module
 * @const
 */
const AuthMiddleware = require("../utils/AuthMiddleware");

/**
 * Joi schema with the structure of a restaurants request.
 * @const
 */
const restaurantSchema = Joi.object({
  city: Joi.string(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
})
  .or("city", "latitude", "longitude")
  .oxor("city", "latitude")
  .oxor("city", "longitude");

/**
 * Route for retrieve near restaurants by city or coordinates.
 * @name get/
 * @function
 * @memberof module:routes/RestaurantsIndex~restaurantsRouter
 * @inner
 * @param {string} path - Express path
 */
router.get(
  "/",
  AuthMiddleware.auth,
  IndexFunctions.validateSchema(restaurantSchema, "query"),
  function (req, res, next) {
    if (req.query.city) {
      RestaurantsLogic.getRestaurantsByCity(req.query.city, req.user.userId)
        .then((data) => res.status(200).send(data))
        .catch((error) => {
          IndexFunctions.handleError(res, error);
        });
    } else {
      RestaurantsLogic.getRestaurantsByCoordinates(
        req.query.latitude,
        req.query.longitude,
        req.user.userId
      )
        .then((data) => res.status(200).send(data))
        .catch((error) => {
          IndexFunctions.handleError(res, error);
        });
    }
  }
);
module.exports = router;
