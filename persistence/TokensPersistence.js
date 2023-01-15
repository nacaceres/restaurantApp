/** Tokens persistence providing all related queries
 * @module persistence/TokensPersistence
 * @requires PostgresConnection
 * @requires UnknownDBException
 */

/**
 * PostgresConnection module
 * @const
 */
const PostgresConnection = require("../services/PostgresqlService");

/**
 * UnknownDBException class
 * @const
 */
const { UnknownDBException } = require("../exceptions/PersistenceExceptions");
/**
 * Performs a query to insert a token.
 * @async
 * @param {object} token An object representing a token.
 * @return {object} The confirmation postgresql object.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.insertToken = async (token) => {
  try {
    const text =
      "INSERT INTO tokens(user_id, token, created_at) VALUES($1, $2, $3) RETURNING *";
    const values = [token.userId, token.token, token.createdAt];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
/**
 * Performs a query to retrieve a token from the token table.
 * @async
 * @param {string} token -  A string with the refresh token.
 * @return {object} An object with the token, undefined if the token does not exist.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.getToken = async (token) => {
  try {
    const text = "SELECT * FROM tokens WHERE token = $1";
    const values = [token];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
/**
 * Performs a query to delete a token from the token table.
 * @async
 * @param {string} token -  A string with the refresh token.
 * @return {number} The number of deleted tokens.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.deleteToken = async (token) => {
  try {
    const text = "DELETE FROM tokens WHERE token = $1";
    const values = [token];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rowCount;
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
