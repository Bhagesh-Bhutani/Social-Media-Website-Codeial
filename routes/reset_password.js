const express = require('express');
const router = express.Router();

const reset_password = require('../controllers/reset_password_controller');

router.get('/', reset_password.getForgotPasswordPage);

router.post('/', reset_password.sendOTP);

router.use('/otp', require('./reset_password_otp'));

router.use('/change-password', require('./reset_password_change_password'));

module.exports = router;