/**
 * AbstractException module
 * @const
 */
const AbstractException = require("./AbstractException");

/**
 * Class representing a failed login exception.
 * @extends AbstractException
 * @class
 */
class FailedLogin extends AbstractException {
  /**
   * Create a failed login exception.
   */
  constructor() {
    super(401, "Incorrect password or email");
  }
}

/**
 * Class representing a duplicate email exception.
 * @extends AbstractException
 * @class
 */
class DuplicateEmail extends AbstractException {
  /**
   * Create a duplicate email exception.
   */
  constructor(email) {
    super(400, `There is already a user created with the email: ${email}`);
  }
}
/**
 * Class representing an Unauthorized exception.
 * @extends AbstractException
 * @class
 */
class Unauthorized extends AbstractException {
  /**
   * Create an Unauthorized exception.
   */
  constructor() {
    super(401, "Unauthorized");
  }
}
/**
 * Class representing a Missing Parameter exception.
 * @extends AbstractException
 * @class
 */
class MissingParameter extends AbstractException {
  /**
   * Create a Missing Parameter exception.
   */
  constructor(parameter) {
    super(400, `Missing query param: ${parameter}`);
  }
}
/**
 * Class representing an invalid city exception.
 * @extends AbstractException
 * @class
 */
class InvalidCity extends AbstractException {
  /**
   * Create an Invalid City exception.
   */
  constructor(city) {
    super(400, `There is not a valid city ${city} or similar`);
  }
}
module.exports = {
  FailedLogin: FailedLogin,
  DuplicateEmail: DuplicateEmail,
  Unauthorized: Unauthorized,
  MissingParameter: MissingParameter,
  InvalidCity: InvalidCity,
};
