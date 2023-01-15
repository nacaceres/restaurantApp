/**
 * Object containing the configuration constants for security utils.
 */
module.exports.securityConfigs = {
  //Salt rounds for encrypting the passwords.
  saltRounds: 10,
  //Expiration time of the refresh token.
  refreshTokenExpTime: "1d",
  //Expiration time of the access token.
  accessTokenExpTime: "15m",
};
