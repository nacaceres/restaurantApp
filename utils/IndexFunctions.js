/** Index functions that for managing common errors and validating schemas with Joi.
 * @module utils/IndexFunctions
 */

/**
 * Function that handle a logic or persistence error and send the error in the HTTP response.
 * @async
 * @param res - The callback res param of an index function.
 * @param error - The logic, persistence or service error.
 */
module.exports.handleError = (res, error) => {
  let statusCode = error.httpCode ? error.httpCode : 500;
  let message = error.httpMessage;
  if (!message) {
    message = "Internal Server Error";
    console.error(error);
  }
  res.status(statusCode).send(message);
};

/**
 * Function that validate a req property schema.
 * @param joiSchema - A Joi schema.
 * @param reqProperty - A request property as body, params, etc.
 */
module.exports.validateSchema = (joiSchema, reqProperty) => {
  return (req, res, next) => {
    const { error } = joiSchema.validate(req[reqProperty]);
    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(400).send(message);
    }
  };
};
