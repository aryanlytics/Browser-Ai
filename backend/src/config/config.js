require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the .env file");
}
if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST is not defined in the .env file");
}
if (!process.env.REDIS_PORT) {
  throw new Error("REDIS_PORT is not defined in the .env file");
}
if (!process.env.REDIS_USERNAME) {
  throw new Error("REDIS_USERNAME is not defined in the .env file");
}
if (!process.env.REDIS_PASSWORD) {
  throw new Error("REDIS_PASSWORD is not defined in the .env file");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT,
};

module.exports = config;
