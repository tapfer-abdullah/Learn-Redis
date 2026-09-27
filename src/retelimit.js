import { redis } from "./index.js";

export const rateLimitMiddleware = (limit=10, windowInSeconds=60) => {
    return async (req, res, next) => {
        const ip = req.ip; // Get the client's IP address
        const key = `rate_limit:${ip}`; // Create a unique key for the IP address

        try {
            // Increment the count for this IP address
            const currentCount = await redis.incr(key);

            if (currentCount === 1) {
                // If this is the first request, set the expiration time for the key
                await redis.expire(key, windowInSeconds);
            }

            if (currentCount > limit) {
                // If the count exceeds the limit, send a 429 response
                return res.status(429).json({ message: "Too many requests. Please try again later." });
            }

            // If the count is within the limit, proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error("Error in rate limiting middleware:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

// This middleware function can be used in your Express routes to limit the number of requests from a single IP address within a specified time window. You can customize the `limit` and `windowInSeconds` parameters when applying the middleware to different routes.