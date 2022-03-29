const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/mailer.config');

let transporter = nodemailer.createTransport(smtpTransport({
    service: config.SERVICE,
    host: config.HOST,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD
    }
}));

module.exports = transporter;