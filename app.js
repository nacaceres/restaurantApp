/**
 * Express app module
 * @requires createError
 * @requires express
 * @requires logger
 * @requires indexRouter
 */
/**
 * createError module
 * @const
 */
const createError = require("http-errors");

/**
 * express module
 * @const
 */
const express = require("express");

/**
 * logger module
 * @const
 */
const logger = require("morgan");

/**
 * indexRouter module
 * @const
 */
const indexRouter = require("./routes/index");

/**
 * Express app
 * @const
 */
const app = express();

/**
 * Add dependencies to the express app
 */
if (!process.env.TEST) {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Serving all the app routes.
 */
app.use("/api/", indexRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use("/", function (req, res, next) {
  next(createError(404));
});

/**
 * Error handler of the express app
 */
app.use("/api/", function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
