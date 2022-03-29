const mongoose = require('mongoose');

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        title: String,
        description: String,
        price: String,
        image: String
    })
);

module.exports = Product;