import mongoose from "mongoose";

const Product = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      lowercase: true,
    },
    category: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Product", Product);
