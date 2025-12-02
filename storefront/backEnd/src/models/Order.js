import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: String,
  price: Number,
  qty: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, processing, shipped, failed
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
