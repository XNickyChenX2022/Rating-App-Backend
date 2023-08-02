import dotenv from "dotenv";
dotenv.config();
import redis from "redis";
import maintainTokens from "../utils/maintainAccessToken.js";
const connectRedis = async () => {
  const redisClient = redis.createClient({
    url: process.env.URL,
  });
  // Connect to redis server
  console.log("connecting");
  redisClient.on("error", (error) =>
    console.error(`Error: in connection: ${error}`)
  );
  await redisClient.connect().then(async () => {
    new maintainTokens(redisClient);
  });
};

export default connectRedis;
