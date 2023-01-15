/**
 * Class representing an abstract exception.
 * @class
 */
class AbstractException {
  /**
   * Create an abstract Exception.
   * @param {number} httpCode - The exception code.
   * @param {string} httpMessage - The exception message.
   */
  constructor(httpCode, httpMessage) {
    this.httpCode = httpCode;
    this.httpMessage = httpMessage;
  }
}
module.exports = AbstractException;
