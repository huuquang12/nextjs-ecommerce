import express from 'express';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';
const orderRouter = express.Router();

orderRouter.post('/', isAuth, async (req, res) => {
    const newOrder = new Order({
        ...req.body,
        user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
});

orderRouter.get('/:id', isAuth, async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.send(order);
})

orderRouter.put('/:id/pay', isAuth, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
        };
        const paidOrder = await order.save();
        res.send({ message: 'order paid', order: paidOrder });
    } else {
        res.status(404).send({ message: 'order not found' });
    }
})

// orderRouter.get('/history', isAuth, async (req, res) => {
//     const orders = await Order.find({ user: req.user._id });
//     res.send(orders);
// })

export default orderRouter;