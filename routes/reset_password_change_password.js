const express = require('express');
const router = express.Router();

const resetPasswordChangePasswordController = require('../controllers/reset_password_change_password_controller');

// /reset-password/change-password/

router.get('/:accessToken', resetPasswordChangePasswordController.getChangePasswordPage);

router.post('/:accessToken', resetPasswordChangePasswordController.checkChangePassword);

module.exports = router;