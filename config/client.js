import dotenv from "dotenv";
dotenv.config();
import redis from "redis";
// import maintainTokens from "../utils/maintainAccessToken.js";

const connectRedis = () => {
  const redisClient = redis.createClient({
    url: process.env.URL,
  });
  // Connect to redis server
  redisClient.on("error", (error) =>
    console.error(`Error: in connection: ${error}`)
  );
  redisClient.connect()
  // .then(async () => {
    // new maintainTokens(redisClient);
  // });
  return redisClient;
};

export { connectRedis };
