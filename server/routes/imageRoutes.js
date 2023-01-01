import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const router = express.Router();

// delete image asset in cloudinary
router.delete("/:public_id", async (req, res) => {
  const { public_id } = req.body;
  console.log(public_id);
  try {
    await cloudinary.uploader.destroy(public_id);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
