import {redis} from "./index.js";

export const createSession = async (userId) => {
    const sessionId = `session:${userId}`;
    await redis.setex(sessionId, 3600, JSON.stringify({ userId }));
    // or using set
    // await redis.set(sessionId, JSON.stringify({ userId }), 'EX', 3600);
    return sessionId;
};

export const getSession = async (sessionId) => {
    const sessionData = await redis.get(sessionId);
    if (sessionData) {
        return JSON.parse(sessionData);
    }
    return null;
};

export const deleteSession = async (sessionId) => {
    await redis.del(sessionId);
};

// all the session management functions are implemented using Redis commands. The createSession function creates a new session for a user and sets an expiration time of 1 hour (3600 seconds). The getSession function retrieves the session data for a given session ID, and the deleteSession function removes the session from Redis.

// we will use these functions in our login-otp.js file to manage user sessions after successful OTP verification.