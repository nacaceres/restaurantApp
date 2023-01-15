/** Module for testing all restaurants services
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
  it("GET /restaurants?city=<city> => returns 200", () => {
    return request(app)
      .get("/api/restaurants?city=Bucaramanga")
      .set("Authorization", "bearer " + accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              rating: expect.any(Number || null),
              address: expect.any(String),
              photos: expect.any(Object),
            }),
          ])
        );
      });
  });
  it("GET /restaurants?latitude=<latitude>&longitude=<longitude> => returns 200", () => {
    return request(app)
      .get(`/api/restaurants?latitude=5.636499&longitude=-73.527058`)
      .set("Authorization", "bearer " + accessToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              rating: expect.any(Number || null),
              address: expect.any(String),
              photos: expect.any(Object),
            }),
          ])
        );
      });
  });
  it("GET /restaurants?latitude=<latitude>&longitude=<longitude> => returns 400 - invalid coordinates", () => {
    return request(app)
      .get("/api/restaurants?latitude=91&longitude=181")
      .set("Authorization", "bearer " + accessToken)
      .expect(400)
      .expect("Content-Type", /text/);
  });
  it("GET /restaurants?city=<city> => returns 400 - invalid city", () => {
    return request(app)
      .get("/api/restaurants?city=asdfg")
      .set("Authorization", "bearer " + accessToken)
      .expect(400)
      .expect("Content-Type", /text/);
  });
  it("GET /restaurants => returns 400 - missing query params", () => {
    return request(app)
      .get("/api/restaurants")
      .set("Authorization", "bearer " + accessToken)
      .expect(400)
      .expect("Content-Type", /text/);
  });
  it("GET /restaurants => returns 401 - invalid access token", () => {
    return request(app)
      .get("/api/restaurants")
      .set("Authorization", "bearer " + accessToken + "invalid")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  it("GET /restaurants => returns 401 - null refresh token", () => {
    return request(app)
      .get("/api/restaurants")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  afterAll((done) => {
    PostgresConnection.closeInstance(done);
  });
});
