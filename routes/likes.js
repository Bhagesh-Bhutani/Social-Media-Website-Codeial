const express = require('express');
const router = express.Router();
const passport = require('passport');

const likesController = require('../controllers/likes_controller');

router.put('/toggle', passport.sign_out_handler ,likesController.toggleLike);

module.exports = router;