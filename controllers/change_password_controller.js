const UserResetPassword = require('../models/user_reset_password');

// /reset-password/change-password/:accessToken
// GET
module.exports.getChangePasswordPage = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        return res.render('reset_password', {
            title: 'Reset Password | Change Password',
            userResetPassword: userResetPassword
        });
    }
};

// /reset-password/change-password/:accessToken
// POST
module.exports.changePassword = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        if(req.body.password != req.body.confirm_password){
            req.flash('');
        }
    } else {
        req.flash('error', 'OTP Expired or not Generated!');
        return res.redirect('/signin');
    }
};