/** Users persistence providing all related queries
 * @module persistence/UsersPersistence
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
 * Performs a query to insert a user.
 * @async
 * @param {object} user An object representing a user.
 * @return {object} The confirmation postgresql object.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.insertUser = async (user) => {
  try {
    const text =
      "INSERT INTO users(name, email, created_at) VALUES($1, $2, $3) RETURNING *";
    const values = [user.name, user.email, user.createdAt];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
/**
 * Performs a query to retrieve an user by his email.
 * @async
 * @param {string} email -  The email of the user.
 * @return {object} An object with the user, undefined if there is not a user with the specified email.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.getUserByEmail = async (email) => {
  try {
    const text = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
