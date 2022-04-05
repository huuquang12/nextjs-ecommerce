import express from "express";
import Cart from "../models/cartModel.js";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const cartRouter = express.Router();

cartRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      // find the cart, whether in session or in db based on the user state
      let cart_user;
      if (req.body.userInfo) {
        cart_user = await Cart.findOne({ user: req.body.userInfo._id });
      }
      // if user is signed in and has cart, load user's cart from the db
      if (req.body.userInfo && cart_user) {
        req.session.cart = cart_user;
        return res.send(cart_user);
      }
      // if there is no cart in session and user is not logged in, cart is empty
      if (!req.session.cart) {
        return res.send({ cartItems: [] });
      }
      // otherwise, load the session's cart
      return res.send({
        cart: req.session.cart,
      });
    } catch (err) {
      console.log(err.message);
      res.send({ message: err.message });
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
      if (
        (req.body.userInfo && !user_cart && req.session.cart) ||
        (!req.body.userInfo && req.session.cart)
      ) {
        cart = await new Cart(req.session.cart);
      } else if (!req.body.userInfo || !user_cart) {
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
      req.session.cart = cart;
      res.send(cart);
    } catch (err) {
      res.send({ message: err.message });
    }
  })
);

cartRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cart = await Cart.deleteOne({ user: req.params.id });
    console.log(cart);
    if (cart.deletedCount == 1) {
      res.send({ message: "Cart Deleted" });
    } else {
      res.status(404).send({ message: "Cart Not Found" });
    }
  })
);

export default cartRouter;
