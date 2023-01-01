import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

// get all products

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// create product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const product = Product.create({
      name,
      description,
      price,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(201).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// update product
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, images: pictures } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.isAdmin)
      return res.status(401).json("You don't have the permission to do this!");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// get detailed one product
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// get products based on the category owned
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    let products;
    if (category === "all") {
      products = await Product.find().sort({ date: -1 });
    } else {
      products = await Product.find({ category });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// CART ROUTES

// add a product to user cart
router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    if (user.cart[productId]) {
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// remove a product from user cart
router.post("/remove-from-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count -= userCart[productId];
    userCart.total -= Number(userCart[productId]) * Number(price);
    delete userCart[productId];
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//increase the amount of product in the cart
router.post("/increase-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    userCart[productId] += 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//decrease the amount of product in the cart
router.post("/decrease-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.count -= 1;
    userCart.total = Number(userCart.total) - Number(price);
    userCart[productId] -= 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
