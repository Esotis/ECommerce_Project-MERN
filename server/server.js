import cors from "cors";
import express from "express";
import STRIPE from "stripe";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import "./connection.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

//initialize stripe with your secret key in stripe account
const stripe = STRIPE(process.env.STRIPE_SECRET);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/images", imageRoutes);
app.use("/orders", orderRoutes);

// give the client_secret to user for making a payment with stripe in UI
app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});

app.set("socketio", io);
