import { redis } from "./index.js";
import express from "express";
const router = express.Router();

const QUEY_KEYS = {
  SEND_EMAIL: "sendEmail",
};



router.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const job = {
        to,
        subject,
        body,
        createdAt: new Date().toISOString(),
    };

    await redis.lpush(QUEY_KEYS.SEND_EMAIL, JSON.stringify(job));
    res.json({ message: "Email job added to queue", job });
});

router.get("/send-process", async (req, res) => {
    const job = await redis.rpop(QUEY_KEYS.SEND_EMAIL);
    if (!job) {
        return res.status(404).json({ error: "No email job in queue" });
    }

    // Here you would typically process the email job, e.g., send the email using a service like nodemailer.

    res.json({ message: "Processing email job", job });
});



export default router;