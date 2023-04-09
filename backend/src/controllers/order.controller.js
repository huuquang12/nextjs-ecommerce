const orderModel = require("../models/order.model");
const { NotFoundError } = require("../core/error.response");

class OrderController {
  createOrder = async (req, res) => {
    const newOrder = new orderModel({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
  };

  historyOrder = async (req, res) => {
    const orders = await orderModel.find({ user: req.user._id });
    res.send(orders);
  };

  shippingOrder = async (req, res) => {
    const order = await orderModel.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const deliveredOrder = await order.save();
      res.send({ message: "Order delivered", order: deliveredOrder });
    } else {
      throw new NotFoundError("Order delivery not found");
    }
  };

  getOrderById = async (req, res) => {
    const order = await orderModel.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      throw new NotFoundError("Order not found");
    }
  };

  payOrder = async (req, res) => {
    const order = await orderModel.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
      };
      const paidOrder = await order.save();
      res.send({ message: "order paid", order: paidOrder });
    } else {
      throw new NotFoundError("Order not found");
    }
  };
}

module.exports = new OrderController();
