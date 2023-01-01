import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// create an order
router.post("/", async (req, res) => {
  const io = req.app.get("socketio");
  const { userId, cart, country, address } = req.body;
  try {
    const user = await User.findById(userId);
    const order = await Order.create({
      owner: userId,
      products: cart,
      country,
      address,
    });
    order.count = cart.count;
    order.total = cart.total;
    await order.save();
    user.cart = { total: 0, count: 0 };
    user.orders.push(order);
    user.markModified("orders");
    await user.save();
    // send the notification event to admin (websocket)
    const notification = {
      status: "unread",
      message: `New order from ${user.name}`,
      time: new Date(),
    };
    io.sockets.emit("new-order", notification);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// get all the orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("owner", ["email", "name"]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// mark as shipped order
router.patch("/:id/mark-shipped", async (req, res) => {
  const { ownerId } = req.body;
  const { id } = req.params;
  const io = req.app.get("socketio");
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, { status: "shipped" });
    const orders = await Order.find().populate("owner", ["email", "name"]);
    //send the notification event to user
    const notification = {
      status: "unread",
      message: `Order ${id} shipped with success`,
      time: new Date(),
    };
    io.sockets.emit("notification", notification, ownerId);
    //save the notification into the user account (database)
    user.notifications.unshift(notification);
    await user.save();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
