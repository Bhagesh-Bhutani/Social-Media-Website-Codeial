const express = require('express');
const router = express.Router();
const passport = require('passport');
const posts_controller = require('../controllers/posts_controller');

router.post('/', passport.sign_out_handler, posts_controller.create);

module.exports = router;