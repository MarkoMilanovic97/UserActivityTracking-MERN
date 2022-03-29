const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmailOrPhone = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        if (user) {
            return res.send({ email_exists: "Error, email already in use" });
        }

        User.findOne({ phone_number: req.body.phone_number }).exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            if (user) {
                return res.send({ phone_number_exists: "Error, phone already in use" });
            }

            next();
        });
    });
};


checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(404).send({ message: `Error, role ${req.body.roles[i]} does not exist` });
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateEmailOrPhone,
    checkRolesExisted
};

module.exports = verifySignUp;