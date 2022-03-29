const mongoose = require('mongoose');

const History = mongoose.Schema({
    items: []
});

const Input = mongoose.Schema({
    search: []
});

const Screenshot = mongoose.Schema({
    screenshots: []
});

const Activity = mongoose.Schema({
    events: []
});


const User = mongoose.model(
    "User",
    new mongoose.Schema({
        first_name: String,
        last_name: String,
        phone_number: String,
        city: String,
        address: String,
        email: String,
        password: String,
        history: History,
        input: Input,
        screenshot: Screenshot,
        activity: Activity,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;