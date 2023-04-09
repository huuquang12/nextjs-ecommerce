const express = require("express");
const { isAuth } = require("../utils/auth.js");
const { asyncHandler } = require("../utils/asyncHandler");
const orderController = require("../controllers/order.controller");

const orderRouter = express.Router();

orderRouter.post("/", isAuth, asyncHandler(orderController.createOrder));

orderRouter.get("/history", isAuth, asyncHandler(orderController.historyOrder));

orderRouter.put(
  "/:id/deliver",
  isAuth,
  asyncHandler(orderController.shippingOrder)
);

orderRouter.get("/:id", isAuth, asyncHandler(orderController.getOrderById));

orderRouter.put("/:id/pay", isAuth, asyncHandler(orderController.payOrder));

module.exports = orderRouter;
