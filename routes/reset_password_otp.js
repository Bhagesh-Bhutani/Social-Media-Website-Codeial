const express = require('express');
const router = express.Router();

const resetPasswordOTPController = require('../controllers/reset_password_otp_controller');

router.get('/:accessToken', resetPasswordOTPController.getOTPPage);

router.post('/:accessToken', resetPasswordOTPController.checkOTP);

module.exports = router;