import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/my-redis-db';
const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';

const app = express();
app.use(express.json());

export const redis = new Redis(REDIS_URI); // Connect to Redis server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI);
    }
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


app.get('/api/redis', async (req, res) => {
    const reply = await redis.ping();
    res.json({ message: reply });
});


app.get('/api/mongo', async (req, res) => {
    try {
        await connectToMongoDB();
        res.json({ message: 'Connected to MongoDB', db: mongoose.connection.db.databaseName });

    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to MongoDB' });
    }
});

import redisRouter from './redis-command.js';
import loginOtpRouter from './login-otp.js';
import queueRouter from './queue.js';
import bullmqRouter from './bullmq/api.js';
import pubsubRouter from './pub-sub/api.js';

import './bullmq/worker.js'; 
import './pub-sub/subscriber.js';
// Import the worker to start processing jobs or you can run it in a separate process for better scalability. like: run it in a separate terminal or as a background service.
// node src/bullmq/worker.js in production use pm2 or docker to run the worker in a separate process for better scalability and reliability.

app.use("/api/redis", redisRouter);
app.use("/api/redis/otp", loginOtpRouter);
app.use("/api/redis/queue", queueRouter);
app.use("/api/redis/bullmq", bullmqRouter);
app.use("/api/redis/pubsub", pubsubRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
