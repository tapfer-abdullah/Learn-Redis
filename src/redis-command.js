import { redis } from "./index.js";
import express from "express";
const router = express.Router();

const REDIS_KEYS = {
  BANNER_DATA: "bannerData",
};

router.post("/banner", async (req, res) => {
  const { bannerData } = req.body;

  if (!bannerData) {
    return res.status(400).json({ error: "Missing bannerData in request body" });
  }

  await redis.set(REDIS_KEYS.BANNER_DATA, JSON.stringify(bannerData));
    res.json({ message: "Banner data stored successfully" });
});

router.get("/banner", async (req, res) => {
    const bannerData = await redis.get(REDIS_KEYS.BANNER_DATA);

    if (!bannerData) {
      return res.status(404).json({ error: "No banner data found" });
    }

    res.json({ bannerData: JSON.parse(bannerData) });
});

router.delete("/banner", async (req, res) => {
    const result = await redis.del(REDIS_KEYS.BANNER_DATA);

    if (result === 0) {
      return res.status(404).json({ error: "No banner data found to delete" });
    }

    res.json({ message: "Banner data deleted successfully" });
});

router.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(REDIS_KEYS.BANNER_DATA);

    res.json({ exists: exists === 1, existsValue: exists });
});

router.get("/banner/ttl", async (req, res) => {
    const exists = await redis.ttl(REDIS_KEYS.BANNER_DATA);

    res.json({ ttl: exists });
});

router.post("/banner/hash", async (req, res) => {
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({ error: "Missing key or value in request body" });
    }

    await redis.hset(key, value);
    res.json({ message: "Banner hash data stored successfully" });
});

router.get("/banner/hash/:key", async (req, res) => {
    const { key } = req.params;

    const value = await redis.hgetall(key);

    if (!value) {
        return res.status(404).json({ error: "No banner hash data found for the given key" });
    }

    res.json({ key, value });
});

router.put("/banner/hash/update-title/:key", async (req, res) => {
  const { key } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing title in request body" });
  }

  const exists = await redis.hexists(key, "title");

  if (!exists) {
    return res.status(404).json({ error: "No banner hash data found for the given key" });
  }

  await redis.hset(key, "title", title);

  // if age exist then increase the age by 1
  if (await redis.hexists(key, "age")) {
    await redis.hincrby(key, "age", 1);
  }

  res.json({ message: "Banner hash title updated successfully" });
});

router.delete("/banner/hash/:key", async (req, res) => {
    const { key } = req.params;

    const result = await redis.hdel(key);

    if (result === 0) {
        return res.status(404).json({ error: "No banner hash data found to delete for the given key" });
    }

    res.json({ message: "Banner hash data deleted successfully" });
});

export default router;