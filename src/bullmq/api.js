import { Queue } from "bullmq";
import express from "express";
import { emailQueue } from "./queue.js";
const router = express.Router();

const QUEY_KEYS = {
  SEND_EMAIL: "sendEmail",
  SEND_WELCOME_EMAIL: "sendWelcomeEmail"
};


router.post("/welcome-email", async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields: to, subject, body" });
  }
  
  try {
    // Add a job to the email queue
    const job = await emailQueue.add(
      QUEY_KEYS.SEND_WELCOME_EMAIL, // Job name
      { to, subject, body },
      {
        attempts: 3, // Retry up to 3 times if the job fails
        backoff: {
          type: "exponential", // Use exponential backoff strategy
          delay: 5000, // Initial delay of 5 seconds before retrying
        },
      }
    );
    res.json({ message: "Email job added to queue", job });
  } catch (error) {
    console.error("Error adding email job to queue:", error);
    res.status(500).json({ error: "Failed to add email job to queue" });
  }
});

export default router;