import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const adminRouter = express.Router();
const upload = multer();

cloudinary.config({
  cloud_name: "dhina2mp9",
  api_key: "653777347631251",
  api_secret: "o8GtXt-dLa01un0bsYtuQlV3BL4",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

adminRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();
    const ordersPriceGroup = await Order.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.send({
      ordersCount,
      productsCount,
      usersCount,
      ordersPrice,
      salesData,
    });
  })
);

adminRouter.get(
  "/orders",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name");
    res.send(orders);
  })
);

adminRouter.get(
  "/products",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

adminRouter.put(
  "/products/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.category = req.body.category;
      product.image = req.body.image;
      product.featuredImage = req.body.featuredImage;
      product.isFeatured = req.body.isFeatured;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: "Product Updated Successfully" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

adminRouter.get(
  "/products/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  })
);

adminRouter.post(
  "/upload",
  isAuth,
  isAdmin,
  upload.single("file"),
  expressAsyncHandler(async (req, res) => {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  })
);

adminRouter.post(
  "/products",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: "sample name",
      slug: "sample-slug",
      image: "/images/shirt1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      description: "sample description",
      rating: 0,
      numReviews: 0,
    });

    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
  })
);

adminRouter.get(
  "/users",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

adminRouter.delete(
  "/products/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

adminRouter.get(
  "/users/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
  })
);

adminRouter.delete(
  "/users/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

adminRouter.put(
  "/users/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isAdmin = Boolean(req.body.isAdmin);
      await user.save();
      res.send({ message: "User Updated Successfully" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default adminRouter;
