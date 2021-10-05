const express = require('express');
const router = express.Router();
const passport = require('passport');

const home_controller = require('../controllers/home_controller');


router.get('/', passport.login_signup_handler, home_controller.home_action);

router.use('/signup', require('./signup'));

router.use('/signin', require('./signin'));

router.use('/reset-password', require('./reset_password'));

router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));

router.use('/likes', require('./likes'));

router.use('/friend-request', require('./friend_request'));

router.use('/friends', require('./friends'));

router.use('/chat', require('./chat'));

router.use('/api', require('./api'));

module.exports = router;