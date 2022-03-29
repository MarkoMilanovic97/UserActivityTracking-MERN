const controller = require('../controllers/product.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post("/api/products-add", controller.addProduct);
    app.put("/api/products-edit/:id", controller.editProduct);
    app.get("/api/products-all", controller.findAll);
    app.get("/api/products-single/:id", controller.findOne);
    app.delete("/api/products-remove/:id", controller.deleteProduct);
};