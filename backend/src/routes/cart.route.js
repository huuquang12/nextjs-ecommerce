const express = require("express");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { isAuth } = require("../utils/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const cartController = require("../controllers/cart.controller");

const cartRouter = express.Router();

cartRouter.get("/remove/:id", asyncHandler(cartController.removeCartById));

cartRouter.get("/user/:id", asyncHandler(cartController.getCartById));

cartRouter.post("/save", asyncHandler(cartController.saveCart));

cartRouter.post("/add/:id", asyncHandler(cartController.addToCart));

cartRouter.post(
  "/update/item/:id",
  asyncHandler(cartController.updateCartQuantity)
);

cartRouter.post("/delete/item/:id", asyncHandler(cartController.deleteCart));

module.exports = cartRouter;
