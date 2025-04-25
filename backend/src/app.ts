import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import orderRoutes from "./routes/order.routes";
import inventoryRoutes from "./routes/inventory.routes";
import notiRoutes from "./routes/noti.routes";


import cookieParser from "cookie-parser";
import path from "path";
import crypto from "crypto";
import qs from "qs";
import { VnpParams } from "./types/VnpParams";

dotenv.config();

const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Use production URL when live
const TMN_CODE = process.env.VNP_TMNCODE || "";
const SECRET_KEY = process.env.VNP_HASHSECRET || "";
const RETURN_URL = "http://localhost:3000/payment-success"; // Change to your frontend success page


const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running!");
});

app.use("/api/auth", authRoutes);

app.use("/api/product/", productRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/cart/", cartRoutes);

app.use("/", paymentRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/noti", notiRoutes);


export default app;
