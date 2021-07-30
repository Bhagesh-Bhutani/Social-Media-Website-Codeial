const express = require('express');
const router = express.Router();
const passport = require('passport');
const posts_controller = require('../controllers/posts_controller');

router.post('/create', passport.sign_out_handler, posts_controller.create);

router.get('/destroy/:id', passport.sign_out_handler, posts_controller.destroy);

module.exports = router;