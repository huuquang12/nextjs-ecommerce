const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const { NotFoundError } = require("../core/error.response");
const cloudinary = ({ v2 } = require("cloudinary"));
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dhina2mp9",
  api_key: "653777347631251",
  api_secret: "o8GtXt-dLa01un0bsYtuQlV3BL4",
});

class AdminController {
  updateRoleUser = async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (user) {
      user.isAdmin = Boolean(req.body.isAdmin);
      await user.save();
      res.send({ message: "User Updated Successfully" });
    } else {
      throw new NotFoundError("User not found");
    }
  };

  deleteUserById = async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (user) {
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      throw new NotFoundError("User not found");
    }
  };

  getUserById = async (req, res) => {
    const user = await userModel.findById(req.params.id);
    res.send(user);
  };

  getAllUsers = async (req, res) => {
    const users = await userModel.find({});
    res.send(users);
  };

  deleteProductById = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted" });
    } else {
      throw new NotFoundError("Product not found");
    }
  };

  createProduct = async (req, res) => {
    const newProduct = new productModel({
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
  };

  uploadProduct = async (req, res) => {
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
  };

  getProductById = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    res.send(product);
  };

  updateProductById = async (req, res) => {
    const product = await productModel.findById(req.params.id);
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
      throw new NotFoundError("Product not found");
    }
  };

  getAllProducts = async (req, res) => {
    const products = await productModel.find({});
    res.send(products);
  };

  getAllOrders = async (req, res) => {
    const orders = await orderModel.find({}).populate("user", "name");
    res.send(orders);
  };

  getSummary = async (req, res) => {
    const ordersCount = await orderModel.countDocuments();
    const productsCount = await productModel.countDocuments();
    const usersCount = await userModel.countDocuments();
    const ordersPriceGroup = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
    const salesData = await orderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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
  };
}

module.exports = new AdminController();
