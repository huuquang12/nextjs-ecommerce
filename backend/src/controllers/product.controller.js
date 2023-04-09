const { Types } = require("mongoose");
const { NotFoundError } = require("../core/error.response");
const productModel = require("../models/product.model");

const PAGE_SIZE = 3;

class ProductController {
  updateQuantity = async (req, res) => {
    req.body.orderItems.forEach(async (item) => {
      const product = await productModel.findByIdAndUpdate(item.productId, {
        countInStock: item.countInStock - item.quantity,
      });
      if (product) {
        res.status(201).json({
          message: "Product updated",
        });
      } else {
        throw new NotFoundError("Product Not Found");
      }
    });
  };

  postReview = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (product) {
      const existReview = product.reviews.find((x) => x.user == req.user._id);
      if (existReview) {
        await productModel.updateOne(
          { _id: req.params.id, "reviews._id": existReview._id },
          {
            $set: {
              "reviews.$.comment": req.body.comment,
              "reviews.$.rating": Number(req.body.rating),
            },
          }
        );

        const updatedProduct = await productModel.findById(req.params.id);
        updatedProduct.numReviews = updatedProduct.reviews.length;
        updatedProduct.rating =
          updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
          updatedProduct.reviews.length;
        await updatedProduct.save();

        return res.send({ message: "Review Updated" });
      } else {
        const review = {
          user: Types.ObjectId(req.user._id),
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
      throw new NotFoundError("Product not found");
    }
  };

  getReviews = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (product) {
      res.send(product.reviews);
    } else {
      throw new NotFoundError("Product not found");
    }
  };

  getProductBySlug = async (req, res) => {
    const product = await productModel.findOne(
      { slug: req.params.slug },
      "-reviews"
    );
    if (product) {
      res.send(product);
    } else {
      throw new NotFoundError("Product slug not found");
    }
  };

  getProductById = async (req, res) => {
    const product = await productModel.findById(
      req.params.id,
      "-reviews -description -category -brand -rating -numReviews -isFeatured"
    );
    if (product) {
      res.send(product);
    } else {
      throw new NotFoundError("Product not found");
    }
  };

  getAllProducts = async (req, res, next) => {
    const featuredProducts = await productModel
      .find({ isFeatured: true }, "-reviews")
      .lean()
      .limit(3);
    const topRatedProducts = await productModel
      .find({ countInStock: { $gt: 0 } }, "-reviews")
      .lean()
      .sort({
        rating: -1,
      })
      .limit(3);
    const lastestProducts = await productModel
      .find({}, "-reviews")
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
  };

  getAllBrands = async (req, res, next) => {
    const brands = await productModel.find().distinct("brand");
    res.send(brands);
  };

  getAllCategories = async (req, res, next) => {
    const categories = await productModel.find().distinct("category");
    res.send(categories);
  };

  searchProduct = async (req, res, next) => {
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

    const categories = await productModel.find().distinct("category");
    const brands = await productModel.find().distinct("brand");
    const productDocs = await productModel
      .find(
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

    const countProducts = await productModel.countDocuments({
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
  };
}

module.exports = new ProductController();
