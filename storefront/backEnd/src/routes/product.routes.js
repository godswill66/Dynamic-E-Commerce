import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// List & search (simple)
router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const page = parseInt(req.query.page || "1");
  const perPage = 12;
  const filter = q ? { title: { $regex: q, $options: "i" } } : {};
  const products = await Product.find(filter).skip((page-1)*perPage).limit(perPage);
  res.json(products);
});

// Get product by slug
router.get("/:slug", async (req, res) => {
  const p = await Product.findOne({ slug: req.params.slug });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

// Admin create
router.post("/", protect, admin, async (req, res) => {
  const data = req.body;
  const product = await Product.create(data);
  res.status(201).json(product);
});

// Admin update
router.put("/:id", protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Admin delete
router.delete("/:id", protect, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
