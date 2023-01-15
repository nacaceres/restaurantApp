/**
 * AbstractException module
 * @const
 */
const AbstractException = require("./AbstractException");
/**
 * Class representing an unknown db exception.
 * @extends AbstractException
 * @class
 */
class UnknownDBException extends AbstractException {
  /**
   * Create an unknown db exception.
   */
  constructor() {
    super(500, "Postgresql service failed unexpectedly");
  }
}
module.exports = {
  UnknownDBException: UnknownDBException,
};
