import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // UUID from MySQL
    product_id: { type: String, required: true }, // UUID from Cassandra
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    image: { type: String, required: false }, // URL or path to the product image
    name: { type: String, required: false }, // URL or path to the product image
    created_at: { type: Date, default: Date.now },
    seller_id: { type: String, required: true }
  });

export const CartItem = mongoose.model("CartItem", CartItemSchema);
