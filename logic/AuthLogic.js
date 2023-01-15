/** Auth logic providing all the logic validations
 * @module logic/AuthLogic
 * @requires UsersPersistence
 * @requires AuthPersistence
 * @requires TokensPersistence
 * @requires SecurityFunctions
 * @requires ConfigConstants
 * @requires LogicExceptions
 */
/**
 * UsersPersistence module
 * @const
 */
const UsersPersistence = require("../persistence/UsersPersistence");
/**
 * AuthPersistence module
 * @const
 */
const AuthPersistence = require("../persistence/AuthPersistence");
/**
 * TokensPersistence module
 * @const
 */
const TokensPersistence = require("../persistence/TokensPersistence");
/**
 * SecurityFunctions module
 * @const
 */
const SecurityFunctions = require("../utils/SecurityFunctions");
/**
 * securityConfigs module
 * @const
 */
const { securityConfigs } = require("../constants/ConfigConstants");
/**
 * Logic Exceptions
 * @const
 */
const {
  FailedLogin,
  DuplicateEmail,
  Unauthorized,
} = require("../exceptions/LogicExceptions");

/**
 * Registration for a new user.
 * @async
 * @param {string} name - The name of the new user.
 * @param {string} email -  The email of the new user.
 * @param {boolean} password - The password of the new user.
 * @throws Will throw an DuplicateEmail if there is an existing user with the same email.
 */
module.exports.createUser = async (name, email, password) => {
  const userResponse = await UsersPersistence.getUserByEmail(email);
  if (userResponse) {
    throw new DuplicateEmail(email);
  }
  const newUser = {
    name: name,
    email: email,
    createdAt: new Date(),
  };
  const userId = (await UsersPersistence.insertUser(newUser)).id;
  const auth = {
    password: await SecurityFunctions.encryptPassword(password),
    userId: userId,
    createdAt: new Date(),
  };
  await AuthPersistence.insertAuthObject(auth);
};
/**
 * Login for a user.
 * @async
 * @param {string} email -  The email of the user that is attempting to authenticate.
 * @param {boolean} password - The password of the user that is attempting to authenticate.
 * @return {object} An object containing the access and refresh token.
 * @throws Will throw an FailedLogin if the credentials are not valid.
 */
module.exports.login = async (email, password) => {
  const userResponse = await UsersPersistence.getUserByEmail(email);
  if (userResponse) {
    const authResponse = await AuthPersistence.getAuthByUserId(userResponse.id);
    const correctPass = await SecurityFunctions.comparePasswords(
      password,
      authResponse.password
    );
    if (!correctPass) {
      throw new FailedLogin();
    }
    const accessToken = SecurityFunctions.signJWT(
      { userId: userResponse.id },
      process.env.JWT_ACCESS_SECRET,
      securityConfigs.accessTokenExpTime
    );
    const refreshToken = SecurityFunctions.signJWT(
      { userId: userResponse.id },
      process.env.JWT_REFRESH_SECRET,
      securityConfigs.refreshTokenExpTime
    );
    await TokensPersistence.insertToken({
      userId: userResponse.id,
      token: refreshToken,
      createdAt: new Date(),
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  } else {
    throw new FailedLogin();
  }
};
/**
 * Create an access token from the refresh token.
 * @async
 * @param {string} refreshToken -  String with the refresh token.
 * @throws Will throw an Unathourized if there refresh token is not valid.
 */
module.exports.createAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Unauthorized();
    }
    const userInfo = await SecurityFunctions.verifyRefreshJWT(refreshToken);
    const tokenResponse = await TokensPersistence.getToken(refreshToken);
    if (!tokenResponse) {
      throw new Unauthorized();
    }
    const accessToken = SecurityFunctions.signJWT(
      { userId: userInfo.userId },
      process.env.JWT_ACCESS_SECRET,
      securityConfigs.accessTokenExpTime
    );
    return { accessToken: accessToken };
  } catch (error) {
    throw new Unauthorized();
  }
};
/**
 * Logout for a user.
 * @async
 * @param {string} refreshToken -  String with the refresh token.
 * @throws Will throw an Unathourized if there refresh token is not valid.
 */
module.exports.logout = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Unauthorized();
    }
    await SecurityFunctions.verifyRefreshJWT(refreshToken);
    const tokenResponse = await TokensPersistence.deleteToken(refreshToken);
    if (tokenResponse < 1) {
      throw new Unauthorized();
    }
  } catch (error) {
    throw new Unauthorized();
  }
};
