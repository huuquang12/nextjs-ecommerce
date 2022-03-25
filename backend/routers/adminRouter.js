import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const adminRouter = express.Router();

adminRouter.get(
    "/summary",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const ordersCount = await Order.countDocuments();
        const productsCount = await Product.countDocuments();
        const usersCount = await User.countDocuments();
        const ordersPriceGroup = await Order.aggregate([
            {
            $group: {
                _id: null,
                sales: { $sum: "$totalPrice"},
            },
        },
        ]); 
        const ordersPrice = 
            ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" },
                    totalSales: { $sum: "$totalPrice"},
                    },
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
    })
);

adminRouter.get(
    "/orders",
    isAdmin,
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({}).populate("user", "name");
        res.send(orders);
    })
);

adminRouter.get(
    "/products",
    isAdmin,
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const products  = await Product.find({});
        res.send(products);
    })
);

adminRouter.get(
    "/products/:id",
    isAdmin,
    isAuth,
    expressAsyncHandler(async (req,res) => {
        const product = await Product.findById(req.params.id);
        res.send(product);
    })
);

export default adminRouter;