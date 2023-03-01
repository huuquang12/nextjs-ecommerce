import express from "express";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

const productRouter = express.Router();

const PAGE_SIZE = 3;

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;

    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const category = query.category || "";
    const brand = query.brand || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const sort = query.sort || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const brandFilter = brand && brand !== "all" ? { brand } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    // 10-50
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};

    const order =
      sort === "featured"
        ? { featured: -1 }
        : sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
        ? { price: -1 }
        : sort === "toprated"
        ? { rating: -1 }
        : sort === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const categories = await Product.find().distinct("category");
    const brands = await Product.find().distinct("brand");
    const productDocs = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
        isFeatured: false,
      },
      "-reviews"
    )
      .sort(order)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
      isFeatured: false,
    });

    res.send({
      productDocs,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    });
  })
);

productRouter.get("/seed", async (req, res) => {
  await Product.deleteMany();
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get(
  "/brands",
  expressAsyncHandler(async (req, res) => {
    const brands = await Product.find().distinct("brand");
    res.send(brands);
  })
);

productRouter.get("/", async (req, res) => {
  const featuredProducts = await Product.find({ isFeatured: true }, "-reviews")
    .lean()
    .limit(3);
  const topRatedProducts = await Product.find(
    { countInStock: { $gt: 0 } },
    "-reviews"
  )
    .lean()
    .sort({
      rating: -1,
    })
    .limit(3);
  const lastestProducts = await Product.find({}, "-reviews")
    .lean()
    .sort({
      createdAt: -1,
    })
    .limit(3);

  res.send({
    featuredProducts,
    topRatedProducts,
    lastestProducts,
  });
});

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(
      req.params.id,
      "-reviews -description -category -brand -rating -numReviews -isFeatured"
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found." });
    }
  })
);

productRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne(
      { slug: req.params.slug },
      "-reviews"
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product slug not found." });
    }
  })
);

productRouter.get(
  "/update/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
    }
  })
);

// Reviews api
productRouter.get(
  "/:id/reviews",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product.reviews);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const existReview = product.reviews.find((x) => x.user == req.user._id);
      if (existReview) {
        await Product.updateOne(
          { _id: req.params.id, "reviews._id": existReview._id },
          {
            $set: {
              "reviews.$.comment": req.body.comment,
              "reviews.$.rating": Number(req.body.rating),
            },
          }
        );

        const updatedProduct = await Product.findById(req.params.id);
        updatedProduct.numReviews = updatedProduct.reviews.length;
        updatedProduct.rating =
          updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
          updatedProduct.reviews.length;
        await updatedProduct.save();

        return res.send({ message: "Review Updated" });
      } else {
        const review = {
          user: mongoose.Types.ObjectId(req.user._id),
          name: req.user.name,
          rating: Number(req.body.rating),
          comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length;
        await product.save();
        res.status(201).send({
          message: "Review Submitted",
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/updated",
  expressAsyncHandler(async (req, res) => {
    req.body.orderItems.forEach(async (item) => {
      const product = await Product.findByIdAndUpdate(item.productId, {
        countInStock: item.countInStock - item.quantity,
      });
      if (product) {
        res.status(201).json({
          message: "Product updated",
        });
        // console.log("Product updated");
      } else {
        res.status(404).json({ message: "Product Not Found" });
        // console.log("Product not found");
      }
    });
  })
);

export default productRouter;
