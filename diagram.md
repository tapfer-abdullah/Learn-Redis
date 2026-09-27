# BullMQ

src/
├── bullmq/
│   ├── queues/
│   │   ├── email.queue.js
│   │   ├── notification.queue.js
│   │   └── report.queue.js
│   │
│   ├── workers/
│   │   ├── email.worker.js
│   │   ├── notification.worker.js
│   │   └── report.worker.js
│   │
│   └── api/
│       └── bullmq.routes.js


email.queue
     │
     └── email.worker
           ├── welcome
           ├── reset password
           ├── order confirmation
           └── invoice

notification.queue
     │
     └── notification.worker
           ├── push
           ├── in-app
           └── SMS

report.queue
     │
     └── report.worker
           ├── sales report
           ├── user report
           └── analytics report


# Pub Sub

Publisher
   │
   │ publish("notifications", message)
   ▼
Redis Pub/Sub
   │
   ├── Subscriber A → receives it
   ├── Subscriber B → receives it
   └── Subscriber C → receives it