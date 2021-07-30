const express = require('express');
const router = express.Router();
const passport = require('passport');
const comments_controller = require('../controllers/comments_controller');

router.post('/create', passport.sign_out_handler, comments_controller.create);

router.get('/destroy/:id', passport.sign_out_handler, comments_controller.destroy);

module.exports = router;