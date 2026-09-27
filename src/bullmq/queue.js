import {Queue} from "bullmq";

export const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379, // Default Redis port
};

export const emailQueue = new Queue("email", { connection });
// export const smsQueue = new Queue("sms", { connection });
// export const notificationQueue = new Queue("notification", { connection });