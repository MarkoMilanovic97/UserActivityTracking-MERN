const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateEmailOrPhone,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );
    app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/buy", controller.buy);
    app.post("/api/auth/change-password", controller.changePassword);
    app.post("/api/auth/reset-password", controller.resetPassword);
    app.post("/api/auth/input", controller.input);
    app.post("/api/auth/screenshot", controller.screenshoot);
    app.post("/api/auth/activity", controller.activity);
    app.get("/api/auth/get_users", controller.get_users);
    app.get("/api/auth/history/:id", controller.history);
    app.get("/api/auth/get_activity/:id", controller.get_activity);
};