const UserResetPassword = require('../models/user_reset_password');

// /reset-password/otp/:accessToken
// GET
module.exports.getOTPPage = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        if(userResetPassword.is_otp_validated){
            req.flash('success', 'Change your Password');
            return res.redirect(`/reset-password/change-password/${userResetPassword.accessToken}`);
        } else {
            userResetPassword = await userResetPassword.populate('user').execPopulate();
            return res.render('forgot_password_otp', {
                title: 'Reset Password | Enter OTP',
                userResetPassword: userResetPassword
            });
        }
    }

    req.flash('error', 'OTP Expired or not Generated!');
    return res.redirect('/signin');
};

// /reset-password/otp/:accessToken
// POST
module.exports.checkOTP = async function(req, res){
    let userResetPassword = await UserResetPassword.findOne({
        accessToken: req.params.accessToken
    });

    if(userResetPassword){
        if(req.body.otp == userResetPassword.otp){
            userResetPassword.is_otp_validated = true;
            await userResetPassword.save();
            return res.redirect(`/reset-password/change-password/${userResetPassword.accessToken}`);
        } else {
            req.flash('error', 'Invalid OTP');
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'OTP Expired or not Generated!');
        return res.redirect('/signin');
    }
};