import { redis } from "./index.js";
import express from "express";
const router = express.Router();

function generateOTPKey(phoneNumber) {
    return `otp:${phoneNumber}`;
}


router.post("/", async (req, res) => {
  const { phoneNumber } = req.body;
  const opt = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

  try {
    // Store the OTP in Redis with a 1-minute expiration
    await redis.set(generateOTPKey(phoneNumber), opt, "EX", 1*60);
    res.json({ message: "OTP generated and stored successfully", otp: opt });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Failed to generate OTP" });
  }
});

router.post("/verify", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Retrieve the OTP from Redis
    const storedOtp = await redis.get(generateOTPKey(phoneNumber));
    console.log("Stored OTP:", storedOtp, "Received OTP:", otp);

    if (storedOtp && storedOtp === otp) {

      res.json({ message: "OTP verified successfully" });
      // Delete the OTP from Redis after successful verification
      await redis.del(generateOTPKey(phoneNumber));
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

router.post("/resend", async (req, res) => {
  const { phoneNumber } = req.body;
  const opt = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a new 6-digit OTP

    try {
        // Store the new OTP in Redis with a 1-minute expiration
        await redis.set(generateOTPKey(phoneNumber), opt, "EX", 1*60);
        res.json({ message: "New OTP generated and stored successfully", otp: opt });
    } catch (error) {
        console.error("Error generating new OTP:", error);
        res.status(500).json({ error: "Failed to generate new OTP" });
    }
});

router.get("/ttl/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    // Get the TTL (time to live) of the OTP in Redis
    const ttl = await redis.ttl(generateOTPKey(phoneNumber));

    res.json({ message: "TTL retrieved successfully", ttl });
  } catch (error) {
    console.error("Error retrieving TTL:", error);
    res.status(500).json({ error: "Failed to retrieve TTL" });
  }
});

export default router;