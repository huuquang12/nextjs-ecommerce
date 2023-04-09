const cartModel = require("../models/cart.model");
const { NotFoundError } = require("../core/error.response");
const productModel = require("../models/product.model");

class CartController {
  deleteCart = async (req, res) => {
    const productId = req.params.id;
    let cart;
    try {
      cart = await cartModel.findOne({ user: req.body.userInfo._id });

      //find the item with productId
      let itemIndex = cart.cartItems.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        await cart.cartItems.remove({ _id: cart.cartItems[itemIndex]._id });
      }
      await cart.save();

      res.send(cart);
    } catch (err) {
      throw new NotFoundError("Cart not found");
    }
  };

  updateCartQuantity = async (req, res) => {
    const productId = req.params.id;
    let cart;
    try {
      cart = await cartModel.findOne({ user: req.body.userInfo._id });
      let itemIndex = cart.cartItems.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity = req.body.quantity;
      }
      await cart.save();
      res.send(cart);
    } catch (err) {
      throw new NotFoundError("Cart not found");
    }
  };

  addToCart = async (req, res) => {
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart;
      if (req.body.userInfo) {
        user_cart = await cartModel.findOne({ user: req.body.userInfo._id });
      }
      let cart;
      if (!req.body.userInfo || !user_cart) {
        cart = new cartModel({});
      } else {
        cart = user_cart;
      }

      // add the product to the cart
      const product = await productModel.findById(productId);
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.productId == productId
      );
      if (itemIndex > -1) {
        // if product exists in the cart, update the quantity
        cart.cartItems[itemIndex].quantity++;
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
  };

  saveCart = async (req, res) => {
    const cart = await cartModel.findOne({ user: req.body.user._id });
    cart.cartItem = req.body.cartItems.map((item) => {
      const productId = item._id;
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.productId == productId
      );
      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity += item.quantity;
      } else {
        cart.cartItems.push({
          ...item,
          productId: productId,
        });
      }
    });
    await cart.save();
    res.send(cart);
  };

  getCartById = async (req, res) => {
    const userId = req.params.id;
    let cart;
    cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId });
      cart.save();
    }
    res.send(cart);
  };

  removeCartById = async (req, res) => {
    const cart = await cartModel.findOne({ user: req.params.id });
    if (cart) {
      await cartModel.findByIdAndDelete(cart._id);
      res.status(201).json({
        message: "Cart removed",
      });
    } else {
      throw new NotFoundError("Cart not found");
    }
  };
}

module.exports = new CartController();
