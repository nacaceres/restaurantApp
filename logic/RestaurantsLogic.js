/** Restaurants logic providing all the logic validations
 * @module logic/RestaurantsLogic
 * @requires LogicExceptions
 * @requires GooglePlacesService
 * @requires RecordsPersistence
 */
/**
 * Logic Exceptions
 * @const
 */
const {
  MissingParameter,
  InvalidCity,
} = require("../exceptions/LogicExceptions");
/**
 * GooglePlacesService module
 * @const
 */
const GooglePlacesService = require("../services/GooglePlacesService");
/**
 * RecordsPersistence module
 * @const
 */
const RecordsPersistence = require("../persistence/RecordsPersistence");
/**
 * Retrieve all restaurants near a city.
 * @async
 * @param {string} city - The city to query.
 * @param {string} userId - The id of the user that is making the query.
 * @return {object} A list with all the restaurants info.
 * @throws Will throw an InvalidCity error if there is not a city with the specified name.
 */
module.exports.getRestaurantsByCity = async (city, userId) => {
  const cityResponse = await GooglePlacesService.getLocationOfCity(city);
  const cityInfo = cityResponse.results[0];
  if (!cityInfo) {
    throw new InvalidCity(city);
  }
  const latitude = cityInfo.geometry.location.lat;
  const longitude = cityInfo.geometry.location.lng;
  const restaurants = await GooglePlacesService.searchRestaurants(
    latitude,
    longitude
  );
  await RecordsPersistence.insertRecord({
    userId: userId,
    city: city,
    latitude: latitude,
    longitude: longitude,
    created_at: new Date(),
  });
  return restaurants.results.map((current) => {
    return {
      name: current.name,
      rating: current.rating || null,
      address: current.vicinity || "Address not available",
      photos: current.photos || [],
    };
  });
};

/**
 * Retrieve all restaurants near a location.
 * @async
 * @param {string} latitude - The latitude of the location to query.
 * @param {string} longitude - The longitude of the location to query.
 * @param {string} userId - The id of the user that is making the query.
 * @return {object} A list with all the restaurants info.
 */
module.exports.getRestaurantsByCoordinates = async (
  latitude,
  longitude,
  userId
) => {
  if (!latitude || !longitude) {
    throw new MissingParameter("latitude or longitude");
  }
  const restaurants = await GooglePlacesService.searchRestaurants(
    latitude,
    longitude
  );
  await RecordsPersistence.insertRecord({
    userId: userId,
    latitude: latitude,
    longitude: longitude,
    created_at: new Date(),
  });
  return restaurants.results.map((current) => {
    return {
      name: current.name,
      rating: current.rating || null,
      address: current.vicinity || "Address not available",
      photos: current.photos || [],
    };
  });
};
