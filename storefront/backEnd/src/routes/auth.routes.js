import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) { next(e); }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ token: generateToken(user), user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) { next(e); }
});

export default router;
