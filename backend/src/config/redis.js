const redis = require("redis");
const config = require("./config");

const redisClient = createClient({
  username: config.REDIS_USERNAME,

  password: config.REDIS_PASSWORD,

  socket: {
    host: config.REDIS_HOST,

    port: config.REDIS_PORT,

    tls: true,
  },
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
