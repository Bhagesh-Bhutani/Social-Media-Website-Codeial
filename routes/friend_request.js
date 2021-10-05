const express = require('express');
const passport = require('passport');
const router = express.Router();

const friendRequestController = require('../controllers/friend_request_controller');

router.post('/send', passport.sign_out_handler, friendRequestController.sendFriendRequest);

router.put('/accept/:friendId', passport.sign_out_handler, friendRequestController.acceptFriendRequest);

router.put('/reject/:friendId', passport.sign_out_handler, friendRequestController.rejectFriendRequest);

router.put('/withdraw/:friendId', passport.sign_out_handler, friendRequestController.withdrawFriendRequest);

router.delete('/remove-friend/:friendId', passport.sign_out_handler, friendRequestController.removeFriend);

module.exports = router;