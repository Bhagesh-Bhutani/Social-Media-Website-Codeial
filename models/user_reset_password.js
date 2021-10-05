const mongoose = require('mongoose');

const userResetPasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    is_otp_validated: {
        type: Boolean,
        default: false,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 120
    }
});

const UserResetPassword = mongoose.model('UserResetPassword', userResetPasswordSchema);

module.exports = UserResetPassword;