require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the .env file");
}
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in the .env file");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_USERNAME: process.env.REDIS_URL,
};

module.exports = config;
