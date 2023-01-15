/** Module for testing all auth services
 * @module test/Auth.test
 * @requires request
 * @requires path
 * @requires dotenv
 * @requires app
 * @requires PostgresConnection
 * @requires uuid
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
 * uuid module
 * @const
 */
const { v4: uuidv4 } = require("uuid");
describe("Authentication tests", () => {
  let name;
  let mockEmail;
  let mockPassword;
  let refreshToken;
  beforeAll(() => {
    PostgresConnection.createInstance();
    name = uuidv4();
    mockEmail = name + "@tyba.com";
    mockPassword = "Password1@";
  });
  it("Post /auth/registration => returns 201", () => {
    return request(app)
      .post("/api/auth/registration")
      .send({
        name: name,
        email: mockEmail,
        password: mockPassword,
      })
      .expect(201);
  });
  it("Post /auth/registration => returns 400 - duplicated email", () => {
    return request(app)
      .post("/api/auth/registration")
      .send({
        name: name,
        email: mockEmail,
        password: mockPassword,
      })
      .expect("Content-Type", /text/)
      .expect(400);
  });
  it("Post /auth/registration => returns 400 - invalid email", () => {
    return request(app)
      .post("/api/auth/registration")
      .send({
        name: name,
        email: name,
        password: mockPassword,
      })
      .expect("Content-Type", /text/)
      .expect(400);
  });
  it("Post /auth/registration => returns 400 - invalid password", () => {
    return request(app)
      .post("/api/auth/registration")
      .send({
        name: name,
        email: name,
        password: "Password",
      })
      .expect("Content-Type", /text/)
      .expect(400);
  });
  it("Post /auth/registration => returns 400 - null name", () => {
    return request(app)
      .post("/api/auth/registration")
      .send({
        name: undefined,
        email: name,
        password: "Password",
      })
      .expect("Content-Type", /text/)
      .expect(400);
  });
  it("Post /auth/login => returns 200", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: mockEmail,
        password: mockPassword,
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        refreshToken = response.body.refreshToken;
        expect(response.body).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          })
        );
      });
  });
  it("Post /auth/login => returns 401 - incorrect password", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: mockEmail,
        password: mockPassword + "failed",
      })
      .expect("Content-Type", /text/)
      .expect(401);
  });
  it("Post /auth/login => returns 401 - nonexistent email", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: "failed" + mockEmail,
        password: mockPassword,
      })
      .expect("Content-Type", /text/)
      .expect(401);
  });
  it("Post /auth/login => returns 401 - missing parameters", () => {
    return request(app)
      .post("/api/auth/login")
      .send({})
      .expect("Content-Type", /text/)
      .expect(400);
  });
  it("Post /auth/accesstoken => returns 200", () => {
    return request(app)
      .post("/api/auth/accesstoken")
      .set("Authorization", "bearer " + refreshToken)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
          })
        );
      });
  });
  it("Post /auth/accesstoken => returns 401 - invalid refresh token", () => {
    return request(app)
      .post("/api/auth/accesstoken")
      .set("Authorization", "bearer " + refreshToken + "invalid")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  it("Post /auth/accesstoken => returns 401 - null refresh token", () => {
    return request(app)
      .post("/api/auth/accesstoken")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  it("Post /auth/logout => returns 200", () => {
    return request(app)
      .post("/api/auth/logout")
      .set("Authorization", "bearer " + refreshToken)
      .expect(200);
  });
  it("Post /auth/logout => returns 401 - invalid refresh token", () => {
    return request(app)
      .post("/api/auth/logout")
      .set("Authorization", "bearer " + refreshToken + "invalid")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  it("Post /auth/logout => returns 401 - null refresh token", () => {
    return request(app)
      .post("/api/auth/logout")
      .expect(401)
      .expect("Content-Type", /text/);
  });
  afterAll((done) => {
    PostgresConnection.closeInstance(done);
  });
});
