import express from "express";
import { Queue } from "bullmq";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const orderQueue = new Queue("orders", {
  connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
});

// Create order (enqueue)
router.post("/", protect, async (req, res, next) => {
  try {
    const { items, total } = req.body;
    const order = await Order.create({ user: req.user._id, items, total, status: "pending" });
    await orderQueue.add("process-order", { orderId: order._id.toString() }, { attempts: 5, backoff: { type: "exponential", delay: 3000 } });
    res.status(201).json({ message: "Order created", orderId: order._id });
  } catch (e) { next(e); }
});

// List user orders
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
