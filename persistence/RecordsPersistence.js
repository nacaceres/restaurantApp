/** Records persistence providing all related queries
 * @module persistence/RecordsPersistence
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
 * Performs a query to insert a record of an user retrieving restaurants.
 * @async
 * @param {object} record An object representing a record.
 * @return {object} The confirmation postgresql object.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.insertRecord = async (record) => {
  try {
    const text =
      "INSERT INTO records(user_id, city, latitude,longitude,created_at) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      record.userId,
      record.city,
      record.latitude,
      record.longitude,
      record.created_at,
    ];
    const client = PostgresConnection.getInstance();
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
/**
 * Performs a query to retrieve all the records.
 * @async
 * @return {object} A list of all the records performed in the API.
 * @throws Will throw an UnknownDBException if there is an error executing the query.
 */
module.exports.fetchAllRecords = async () => {
  try {
    const text =
      "SELECT users.email, records.city, records.latitude, records.longitude, records.created_at FROM records INNER JOIN users ON records.user_id=users.id;";
    const client = PostgresConnection.getInstance();
    const response = await client.query(text);
    return response.rows;
  } catch (err) {
    console.log(err);
    throw new UnknownDBException();
  }
};
