var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../config/auth.config');
const db = require('../models');
const mailer = require('../mail/mail.transporter');
const registration_template = require('../mail/templates/registration.template');
const password_template = require('../mail/templates/password.template');
const purchase_template = require('../mail/templates/purchase.template');
const User = db.user;
const Role = db.role;


//Registracija
exports.signup = (req, res) => {
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        city: req.body.city,
        address: req.body.address,
        phone_number: req.body.phone_number,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        history: {
            items: []
        },
        input: {
            search: []
        },
        screenshot: {
            screenshots: []
        },
        activity: {
            events: []
        }
    });

    user.save((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        return res.status(500).send({ message: err });
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            return res.status(500).send({ message: err });
                        }

                        res.status(200).send({ message: "User was registered successfully!" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        return res.status(500).send({ message: err });
                    }
                    mailer.sendMail({
                        to: req.body.email,
                        subject: "Uspesna registracija",
                        html: registration_template.template()
                    });
                    res.status(200).send({ message: "User was registered siccessfully!" });
                });
            });
        }
    });
};


//Prijava
exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).populate("roles", "-__v").exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!user) {
            return res.send({ user_not_found: "User does not exist" });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.send({
                accessToken: null,
                invalid_password: "Invalid Password"
            });
        }

        var token = jwt.sign({
            id: user.id,
            roles: user.roles,
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
            city: user.city,
            phone_number: user.phone_number,
            email: user.email
        }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({
            accessToken: token
        });
    });
};

//Kupovina
exports.buy = (req, res) => {
    data = req.body;
    if (!data) {
        return res.status(404).send({ no_data: "No data" });
    }

    data.code = Math.floor(Math.random() * 123456789);

    mailer.sendMail({
        to: data.email,
        subject: "Uspesna kupovina",
        html: purchase_template.template(data)
    });

    User.findOne({ _id: req.body.id }).then(user => {
        user.history.items.push(data);
        user.save();
    });

    res.status(200).send({ success: "Success" });
};


//Istorija kupovine
exports.history = (req, res) => {
    User.findOne({ _id: req.params.id }).then(user => {
        res.status(200).send(user.history);
    });
};


//Zaboravljena lozinka
exports.resetPassword = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            res.status(404).send({ user_not_found: "User not found" });
        }

        let new_password = Math.random().toString(16).substr(2, 8);
        mailer.sendMail({
            to: user.email,
            subject: "Zaboravljena lozinka",
            html: password_template.template(new_password)
        });

        user.password = bcrypt.hashSync(new_password, 8);
        user.save();
        res.status(200).send({ success: "Success" });
    });
};

//Promena lozinke
exports.changePassword = (req, res) => {
    User.findOne({ _id: req.body.id }).then(user => {

        if (!user) {
            return res.status(404).send({ user_not_found: "User not found" });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.current_password, user.password);

        if (!passwordIsValid) {
            res.send({ password_invalid: "Invalid password" });
        } else {
            user.password = bcrypt.hashSync(req.body.new_password, 8);
            user.save();
            res.status(200).send({ success: "Success" });
        }
    });
};

//Unos sa tastature prilikom pretrazivanja proizovda
exports.input = (req, res) => {
    User.findOne({ _id: req.body.id }).then(user => {
        if (!user) {
            return res.status(404).send({ user_not_found: "User not found" });
        }

        user.input.search.push(req.body.search);
        user.save();
        res.send({ success: "Success" });
    });
};

//Snimak ekrana
exports.screenshoot = (req, res) => {
    User.findOne({ _id: req.body.id }).then(user => {

        if (!user) {
            return res.status(404).send({ user_not_found: "User not found" });
        }

        user.screenshot.screenshots.push(req.body.ss);
        user.save();
        res.send({ success: "Success" });
    });
};

//Pracenje aktivnosti misa
exports.activity = (req, res) => {
    User.findOne({ _id: req.body.id }).then(user => {
        if (!user) {
            return res.status(404).send({ user_not_found: "User not found" });
        }

        user.activity.events.push(req.body.event);
        user.save();
        res.send({ success: "Success" });
    });
};

//Prikazi sve korisnike
exports.get_users = (req, res) => {
    User.find().then(data => {
        if (!data) {
            return res.send({ no_users: "No users found" });
        }
        data = data.filter((val) => {
            return val.email !== "admin@a.com"
        });
        res.status(200).send(data);
    })
};

//Prikazi aktivnost jednog korisnika
exports.get_activity = (req, res) => {
    User.findOne({ _id: req.params.id }).then(user => {
        if (!user) {
            return res.status(404).send({ user_not_found: "User not found" });
        }

        res.status(200).send(user);
    });
};