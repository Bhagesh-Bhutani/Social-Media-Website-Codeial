const User = require('../models/user');
const UserResetPassword = require('../models/user_reset_password');

// /reset-password/change-password/:accessToken
// GET
module.exports.getChangePasswordPage = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        if(userResetPassword.is_otp_validated){
            return res.render('reset_password', {
                title: 'Reset Password | Change Password',
                userResetPassword: userResetPassword
            });
        } else {
            return res.redirect(`/reset-password/otp/${userResetPassword.accessToken}`);
        }
    }

    req.flash('error', 'OTP Expired or not Generated!');
    return res.redirect('/signin');
};

// /reset-password/change-password/:accessToken
// POST
module.exports.checkChangePassword = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        if(userResetPassword.is_otp_validated){
            if(req.body.password != req.body.confirm_password){
                req.flash('error', 'Password and Confirm Password do not Match!');
                return res.redirect('back');
            }
            // Passwords match and otp validated, now change password
            let user = await User.findOne({
                email: userResetPassword.email
            });

            user.password = req.body.password;
            await user.save();

            req.flash('success', 'Password Changed Successfully!');
            return res.redirect('/signin');
        } else {
            return res.redirect(`/reset-password/otp/${userResetPassword.accessToken}`);
        }
    }
    
    req.flash('error', 'OTP Expired or not Generated!');
    return res.redirect('/signin');
};