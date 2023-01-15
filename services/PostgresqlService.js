/**
 * UnknownDBException class
 * @const
 */
const { UnknownDBException } = require("../exceptions/PersistenceExceptions");

/**
 * Postgresql pool module
 * @const
 */
const { Pool } = require("pg");

/**
 * Class encharge of creating and maintaining a pool of postgresql connections.
 * The methods are static and used by the persistence layer, www and tests.
 * @class
 */
class PostgresConnection {
  /**
   * Attribute that models a pool of Postgresql db connections.
   * @static
   */
  static instance = null;

  /**
   * Create a pool of connections using Pool and assign the result to the instance attribute.
   * @static
   * @throws Will throw an UnknownDBException error if the instance is not created successfully.
   */
  static createInstance() {
    if (this.instance !== null) {
      throw "Already instantiated";
    } else {
      try {
        this.instance = new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });
        if (!process.env.TEST) {
          console.log("Connected successfully to the db:", process.env.DB_HOST);
        }
      } catch (error) {
        console.log("Error connecting to the postgresql database: ", error);
        throw new UnknownDBException();
      }
    }
  }

  /**
   * Get function for the instance attribute.
   * @static
   * @return A db instance over the database.
   * @throws Will throw an UnknownDBException error if the instance is not created.
   */
  static getInstance() {
    if (this.instance === null) {
      console.log("The postgresql connection pool has not been instantiated");
      throw new UnknownDBException();
    } else {
      return this.instance;
    }
  }
  /**
   * Close the pool instance attribute.
   * @static
   * @throws Will throw an UnknownDBException error if the instance is not created.
   */
  static closeInstance(done) {
    if (this.instance === null) {
      console.log("The postgresql connection pool has not been instantiated");
      throw new UnknownDBException();
    } else {
      this.instance.end(done);
      this.instance = null;
    }
  }
}

module.exports = PostgresConnection;
