const db = require('../models');
const Product = db.product;

//Dodaj proizvod
exports.addProduct = (req, res) => {
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image
    });

    product.save(product).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occured while adding a product." });
    });
};

//Prikaz svhi proizvoda ili pretraga po nazivu
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    Product.find(condition).then(data => {
        if (!data) {
            res.status(404).send({ message: "Product not found" });
        } else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occurred while retrieving products." });
    });
};

//Prikaz jednog proizvoda
exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findById(id).then(data => {
        if (!data) {
            res.status(404).send({ message: "Cannot find product with id: " + id });
        } else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occured while retrieving a product with id: " + id });
    });
};

//Uredjivanje proizvoda
exports.editProduct = (req, res) => {
    const id = req.params.id;

    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot update a product with id: ${id}. Maybe product doesn't exist.` });
        } else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({ message: err.message || "An error occured while updating a product with id: " + id });
    });
};

//Brisnaje proizovda
exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    Product.findByIdAndRemove(id).then(data => {
        if (!data) {
            res.status(404).send({ message: `Cannot delete a product with id: ${id}. Maybe product doesn't exist.` });
        } else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({ message: err.message || "Could not delete Product wiht id: " + id });
    });
};