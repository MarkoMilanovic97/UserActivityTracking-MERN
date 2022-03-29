const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;
const Role = db.role;

//Verifikacija tokena
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({ unauthorized: "Unauthorized" });
        }
        req.userId = decoded.id;
        next();
    });
};

//Provera admin uloge
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }

                if (roles[0].name === "admin") {
                    return next();
                }

                return res.status(403).send({ message: "Require Admin Role!" });
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;