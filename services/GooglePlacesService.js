/** Module that provide google places functions
 * @module services/GooglePlacesService
 * @requires axios
 */

/**
 * axios module
 * @const
 */
const axios = require("axios").default;

/**
 * Get all restaurants near a location passed by parameter.
 * @async
 * @param {string} latitude - The latitude of the location to query.
 * @param {string} longitude - The longitude of the location to query.
 * @return {object} An list with all the restaurants near the location.
 */
module.exports.searchRestaurants = async (latitude, longitude) => {
  const request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(
    latitude + "," + longitude
  )}&radius=1500&type=restaurant&key=${process.env.GOOGLE_API_KEY}&language=es`;
  return (await axios.get(request)).data;
};

/**
 * Get the location (latitude and longitude) of the city specified by parameter.
 * @async
 * @param {string} city - A string containing the city name.
 * @return {object} An object with the latitude and longitude of the city.
 */
module.exports.getLocationOfCity = async (city) => {
  return (
    await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address==${encodeURIComponent(
        city
      )}&key=${process.env.GOOGLE_API_KEY}`
    )
  ).data;
};
