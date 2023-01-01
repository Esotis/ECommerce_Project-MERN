import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    res.json(user);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).send("Email already exists");
    res.status(400).send(error.message);
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get Users

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate("orders");
    res.json(users);
  } catch (error) {
    res.status(400).send(error.messsage);
  }
});

// get user orders
router.get("/:id/orders", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("orders");
    res.status(200).json(user.orders);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//mark the user notifications as read
router.post("/:id/updateNotifications", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notification) => {
      notification.status = "read";
    });
    user.markModified("notifications");
    await user.save();
    res
      .status(200)
      .send("Successfully marked all notifications to read status");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
