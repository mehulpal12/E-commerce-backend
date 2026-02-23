import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: String,
    },
    discount: {
      type: String,
    },
    rating: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);
