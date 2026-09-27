import Redis from "ioredis";
import express from "express";
const router = express.Router();

const publisher = new Redis(process.env.REDIS_URI || "redis://localhost:6379");

router.post("/notifications", async (req, res) => {
    const body = req.body;

    const payload = {
        ...body,
        createdAt: new Date().toISOString(),
    }

    try {
       const received =  await publisher.publish("notifications", JSON.stringify(payload));
        res.json({ message: `Message published to channel notifications`, received });
    } catch (error) {
        console.error("Error publishing message:", error);
        res.status(500).json({ error: "Failed to publish message" });
    }
});



export default router;