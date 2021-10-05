const mongoose = require('mongoose');

const onlineUserSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'User'
    },
    socket_id: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

const OnlineUser = mongoose.model('OnlineUser', onlineUserSchema);

module.exports = OnlineUser;