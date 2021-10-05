const express = require('express');
const passport = require('passport');
const router = express.Router();

const signUpOTPController = require('../controllers/user_sign_up_otp_controller');

router.get('/:accessToken', passport.login_signup_handler, signUpOTPController.getOTPPageCreateUser);

router.post('/:accessToken', signUpOTPController.createUser);

module.exports = router;