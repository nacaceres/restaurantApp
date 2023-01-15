/**
 * axios module
 * @const
 */
const axios = require("axios").default;
/**
 * uuid module
 * @const
 */
const { v4: uuidv4 } = require("uuid");
/**
 * Class encharge of maintaining some mock credentials for test validations.
 * The methods are static and used by the test to mock authentication.
 * @class
 */
class Credentials {
  /**
   * Attribute that models the accessToken.
   * @static
   */
  static accessToken = null;

  /**
   * Setter method for email and password attributes.
   * @static
   */
  static async setCredentials(url) {
    if (this.accessToken === null) {
      const name = uuidv4();
      const mockEmail = name + "@tyba.com";
      const mockPassword = "Password1@";
      await axios.post(url + "api/auth/registration", {
        name: name,
        email: mockEmail,
        password: mockPassword,
      });
      const response = await axios.post(url + "api/auth/login", {
        email: mockEmail,
        password: mockPassword,
      });
      this.accessToken = response.data.accessToken;
    }
  }

  /**
   * Getter method for email and password attributes.
   * @static
   * @return {object} An object with the credentials.
   */
  static getCredentials() {
    return this.accessToken;
  }
}

module.exports = Credentials;
