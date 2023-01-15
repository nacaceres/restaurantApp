/** Module for testing all records services
 * @module test/Auth.test
 * @requires request
 * @requires path
 * @requires dotenv
 * @requires app
 * @requires PostgresConnection
 * @requires MockCredentials
 */
/**
 * request module
 * @const
 */
const request = require("supertest");
/**
 * path module
 * @const
 */
const path = require("path");
/**
 * dotenv module
 */
require("dotenv").config({ path: path.join(__dirname, `../.env.test`) });
/**
 * app module
 * @const
 */
const app = require("../app");
/**
 * PostgresConnection module
 * @const
 */
const PostgresConnection = require("../services/PostgresqlService");
/**
 * MockCredentials module
 * @const
 */
const MockCredentials = require("./MockCredentials");
describe("Authentication tests", () => {
  let accessToken;
  beforeAll(async () => {
    PostgresConnection.createInstance();
    const response = request(app).get("/");
    await MockCredentials.setCredentials(response.url);
    accessToken = MockCredentials.getCredentials();
  });

  it("GET /records => returns 200", () => {
    return request(app)
      .get("/api/records")
      .set("Authorization", "bearer " + accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: expect.any(String),
              city: expect.any(String || null),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              created_at: expect.any(String),
            }),
          ])
        );
      });
  });
  it("GET /records => returns 401 - invalid access token", () => {
    return request(app)
      .get("/api/records")
      .set("Authorization", "bearer " + accessToken + "invalid")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  it("GET /records => returns 401 - null refresh token", () => {
    return request(app)
      .get("/api/records")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  afterAll((done) => {
    PostgresConnection.closeInstance(done);
  });
});
