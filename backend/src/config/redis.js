const { createClient } = require("redis");
const config = require("./config");

const redisClient = createClient({
  url: config.REDIS_URL_,
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  await redisClient.connect();

  console.log("Redis connected successfully");
}

module.exports = {
  redisClient,
  connectRedis,
};
