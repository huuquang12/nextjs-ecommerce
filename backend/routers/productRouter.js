import express from "express";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

const productRouter = express.Router();

productRouter.get("/seed", async (req, res) => {
  await Product.deleteMany();
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found." });
    }
  })
);

productRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product slug not found." });
    }
  })
);

export default productRouter;