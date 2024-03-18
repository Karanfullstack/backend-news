import redis from "express-redis-cache";

const redisCache = redis({
	port: 6379,
	host: process.env.REDIS_HOST,
	prefix: "news-backend-cache",
	expire: 60, // 60 seconds
});

export default redisCache;
