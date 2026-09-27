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


// handle failed jobs after all retries have been exhausted. You can listen for the 'failed' event on the queue to handle such cases.

router.get("/failed-jobs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const jobs = await emailQueue.getFailed((page - 1) * limit, page * limit - 1); // Fetch failed jobs with pagination

    res.json({
      jobs: jobs.map(job => ({
        id: job.id,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        timestamp: job.timestamp,
      }))
    });

  } catch (error) {
    console.error("Error fetching failed jobs:", error);
    res.status(500).json({ error: "Failed to fetch failed jobs" });
  }
});

// execute failed jobs after all retries have been exhausted. You can listen for the 'failed' event on the queue to handle such cases.
router.post("/retry-failed-job/:jobId", async (req, res) => {
  try {
    const job = await emailQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        error: "Job not found"
      });
    }

    if (!(await job.isFailed())) {
      return res.status(400).json({
        error: "Job is not failed" 
      });
    }

    await job.retry(); // it means that the job will be retried and will be moved back to the waiting state in the queue, allowing it to be processed again by a worker. The job will retain its original data and settings, including any attempts and backoff strategies that were defined when it was first added to the queue.

    res.json({
      message: "Job queued for retry",
      jobId: job.id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retry job"
    });
  }
});

export default router;