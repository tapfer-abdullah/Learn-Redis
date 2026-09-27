 import Redis from "ioredis"

 const subscriber = new Redis(process.env.REDIS_URI || "redis://localhost:6379");

// multiple channels can be subscribed to by passing an array of channel names to the subscribe method. For example:
// await subscriber.subscribe(
//     "notifications",
//     "chat",
//     "orders",
//     "payments", 
//     (err, count) => {
//         if (err) {
//             console.error("Failed to subscribe: %s", err.message);
//         } else {
//             console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
//         }
//     }
// );

 subscriber.subscribe("notifications", (err, count) => {
     if (err) {
         console.error("Failed to subscribe: %s", err.message);
     } else {
         console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
     }
 });

 subscriber.on("message", (channel, message) => {
        console.log(`Received message from channel ${channel}`, message);
        // Here you can add logic to handle the received message, such as saving it to a database or triggering other actions.

        // Now bashed on the channel name like: "notifications" you can perform different actions. For example, if the channel is "notifications", you might want to save the message to a notifications collection in MongoDB or send it to connected clients via WebSocket.
 });

 export default subscriber;