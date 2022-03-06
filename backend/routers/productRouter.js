const express = require("express");
const router = express.Router();

const data = require("../data.js");

const Product = require("../models/productModel.js");

router.get('/seed', async (req, res) => {
    await Product.deleteMany();
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
})

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products);
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product)
    }
    else {
        res.status(404).send({ message: 'Product not found.' })
    }
})

module.exports = router;