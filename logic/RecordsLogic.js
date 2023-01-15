/** Records logic providing all the logic validations
 * @module logic/RecordsLogic
 * @requires RecordsPersistence
 */

/**
 * RecordsPersistence module
 * @const
 */
const RecordsPersistence = require("../persistence/RecordsPersistence");
/**
 * Retrieve all records of queries.
 * @async
 * @return {object} A list of objects with all the queries info.
 */
module.exports.getAllRecords = async () => {
  return await RecordsPersistence.fetchAllRecords();
};
