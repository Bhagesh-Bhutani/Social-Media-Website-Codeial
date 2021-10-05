const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;