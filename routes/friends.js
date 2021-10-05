const express = require('express');
const passport = require('passport');
const router = express.Router();

const friendsController = require('../controllers/friends_controller');

router.get('/', passport.sign_out_handler, friendsController.friendList);


module.exports = router;