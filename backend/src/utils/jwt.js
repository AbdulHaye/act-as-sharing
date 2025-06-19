const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const signJWT = (payload, expiresIn = process.env.JWT_EXPIRATION) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { signJWT, verifyJWT };