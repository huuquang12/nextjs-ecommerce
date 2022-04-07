import express from "express";
import Cart from "../models/cartModel.js";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const cartRouter = express.Router();

cartRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndRemove({ user: req.params.id });
  })
);

cartRouter.get(
  "/user/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }
    res.send(cart);
  })
);

cartRouter.post(
  "/save",
  expressAsyncHandler(async (req, res) => {
    const existCart = await Cart.find({ user: req.body.user._id });
    if (existCart.length <= 0) {
      const cart = new Cart({ user: req.body.user._id });
      cart.cartItem = req.body.cartItems.map((item) => {
        const productId = item._id;
        cart.cartItems.push({
          ...item,
          productId: productId,
        });
      });
      cart.save();
      res.send(cart);
    }
  })
);

cartRouter.post(
  "/add/:id",
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart;
      if (req.body.userInfo) {
        user_cart = await Cart.findOne({ user: req.body.userInfo._id });
      }
      let cart;
      if (!req.body.userInfo || !user_cart) {
        cart = new Cart({});
      } else {
        cart = user_cart;
      }

      // add the product to the cart
      const product = await Product.findById(productId);
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.productId == productId
      );
      if (itemIndex > -1) {
        // if product exists in the cart, update the quantity
        cart.cartItems[itemIndex].quantity++;
        cart.cartItems[itemIndex].price =
          cart.cartItems[itemIndex].quantity * product.price;
        cart.totalQty++;
        cart.totalCost += product.price;
      } else {
        // if product does not exists in cart, find it in the db to retrieve its price and add new item
        cart.cartItems.push({
          name: product.name,
          slug: product.slug,
          countInStock: product.countInStock,
          productId: productId,
          quantity: 1,
          price: product.price,
          image: product.image,
        });
        cart.totalQty++;
        cart.totalCost += product.price;
      }

      // if the user is logged in, store the user's id and save cart to the db
      if (req.body.userInfo) {
        cart.user = req.body.userInfo._id;
        await cart.save();
      }
      res.send(cart);
    } catch (err) {
      console.log({ message: err.message });
    }
  })
);

cartRouter.post("/update/item/:id", async (req, res) => {
  const productId = req.params.id;
  let cart;
  try {
    cart = await Cart.findOne({ user: req.body.userInfo._id });
    let itemIndex = cart.cartItems.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = req.body.quantity;
    }
    await cart.save();
    res.send(cart);
  } catch (err) {
    res.send({ message: "Cart Not Found" });
  }
});

cartRouter.post("/delete/item/:id", async (req, res) => {
  const productId = req.params.id;
  let cart;
  try {
    cart = await Cart.findOne({ user: req.body.userInfo._id });

    //find the item with productId
    let itemIndex = cart.cartItems.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      await cart.cartItems.remove({ _id: cart.cartItems[itemIndex]._id });
    }
    await cart.save();

    res.send(cart);
  } catch (err) {
    res.send({ message: "Cart Not Found" });
  }
});

export default cartRouter;
