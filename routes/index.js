const express = require('express');
const router = express.Router();
const passport = require('passport');

const home_controller = require('../controllers/home_controller');


router.get('/', passport.login_signup_handler, home_controller.home_action);

router.use('/signup', require('./signup'));

router.use('/signin', require('./signin'));

router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));

router.use('/api', require('./api'));

module.exports = router;