/** Auth persistence providing all related queries
 * @module persistence/AuthPersistence
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
 * Performs a query to insert a auth object.
 * @async
 * @param {object} auth An object representing a auth object.
 * @return {object} The confirmation postgresql object.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.insertAuthObject = async (auth) => {
  try {
    const text =
      "INSERT INTO auth(user_id, password, created_at) VALUES($1, $2, $3) RETURNING *";
    const values = [auth.userId, auth.password, auth.createdAt];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
/**
 * Performs a query to retrieve an auth object by his user_id.
 * @async
 * @param {string} userId -  The userId of the auth object.
 * @return {object} An object with the auth object, undefined if there is not a auth object with the specified user_id.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.getAuthByUserId = async (userId) => {
  try {
    const text = "SELECT * FROM auth WHERE user_id = $1";
    const values = [userId];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
