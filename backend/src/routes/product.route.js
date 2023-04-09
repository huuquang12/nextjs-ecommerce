const { asyncHandler } = require("../utils/asyncHandler");
const productController = require("../controllers/product.controller");
const { isAuth } = require("../utils/auth");

const express = require("express");
const productRouter = express.Router();

// productRouter.get("/seed", async (req, res) => {
//   await Product.deleteMany();
//   const createdProducts = await Product.insertMany(data.products);
//   res.send({ createdProducts });
// });

productRouter.get("/search", asyncHandler(productController.searchProduct));

productRouter.get(
  "/categories",
  asyncHandler(productController.getAllCategories)
);

productRouter.get("/brands", asyncHandler(productController.getAllBrands));

productRouter.get("/", asyncHandler(productController.getAllProducts));

productRouter.get("/:id", asyncHandler(productController.getProductById));

productRouter.get(
  "/slug/:slug",
  asyncHandler(productController.getProductBySlug)
);

// Reviews api
productRouter.get("/:id/reviews", asyncHandler(productController.getReviews));

productRouter.post(
  "/:id/reviews",
  isAuth,
  asyncHandler(productController.postReview)
);

productRouter.post("/updated", asyncHandler(productController.updateQuantity));

module.exports = productRouter;
