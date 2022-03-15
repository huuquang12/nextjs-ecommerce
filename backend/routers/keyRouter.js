import express from 'express';
import { isAuth } from '../utils.js';
const keyRouter = express.Router();

keyRouter.get('/paypal', isAuth, (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default keyRouter;