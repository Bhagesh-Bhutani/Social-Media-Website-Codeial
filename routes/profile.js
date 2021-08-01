const express = require('express');
const router = express.Router();
const passport = require('passport');
const user_profile_controller = require('../controllers/user_profile_controller');

router.get('/:id', passport.sign_out_handler ,user_profile_controller.getProfile);

module.exports = router;