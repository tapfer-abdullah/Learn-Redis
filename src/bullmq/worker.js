import {connection, emailQueue} from "./queue.js";
import {Worker} from "bullmq";

const emailWorker = new Worker(
    "email",
    async (job) => {
        // Simulate sending an email
        console.log(`Sending email to ${job.data.to} with subject: ${job.data.subject}`, {id: job.id, name: job.name, data: job.data});
        // Here you would typically integrate with an email service like nodemailer or SendGrid.
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    },
    { connection }
);

emailWorker.on("completed", (job) => {
    console.log(`Email job completed: ${job.id}, name: ${job.name}, data: ${JSON.stringify(job.data)}`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`Email job failed: ${job.id}, name: ${job.name} Error: ${err.message}`);
});


// const emailWorker = new Worker(
//   "email",
//   async (job) => {
//     switch (job.name) {
//       case "sendWelcomeEmail":
//         // ...
//         break;

//       case "sendPasswordResetEmail":
//         // ...
//         break;

//       case "sendOrderConfirmation":
//         // ...
//         break;
//     }
//   },
//   { connection }
// );


// import { Worker } from "bullmq";
// import { connection } from "./queue.js";

// export const emailWorker = new Worker(
//     "email",
//     async (job) => {
//         console.log("Email:", job.name, job.data);
//     },
//     { connection }
// );

// export const smsWorker = new Worker(
//     "sms",
//     async (job) => {
//         console.log("SMS:", job.name, job.data);
//     },
//     { connection }
// );

// export const notificationWorker = new Worker(
//     "notification",
//     async (job) => {
//         console.log("Notification:", job.name, job.data);
//     },
//     { connection }
// );