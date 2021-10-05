const User = require('../models/user');
const UserResetPassword = require('../models/user_reset_password');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const queue = require('../workers/otp_reset_password_email_worker');

module.exports.getForgotPasswordPage = function(req, res){
    return res.render('forgot_password_email', {
        title: 'Reset Password | Enter Email-ID'
    });
};

module.exports.sendOTP = async function(req, res){
    try{
        let user = await User.findOne({
            email: req.body.email
        });
        if(user){
            // Either Previous OTP is there or not
            let userResetPassword = await UserResetPassword.findOne({
                email: req.body.email
            });
            if(userResetPassword){
                await userResetPassword.remove();
            }
            let newUserResetPassword = await UserResetPassword.create({
                user: user._id,
                email: user.email,
                accessToken: crypto.randomBytes(30).toString('hex'),
                otp: otpGenerator.generate(6, {
                    alphabets: false,
                    upperCase: false,
                    specialChars: false
                })
            });

            newUserResetPassword = await newUserResetPassword.populate('user').execPopulate();

            let job = queue.create('otp_reset_password', newUserResetPassword).priority('high').save(function(err){
                if(err){
                    console.log("Error while creating otp_reset_password job", err);
                    return;
                }
                console.log(job.id);
            });

            req.flash('success', 'OTP sent to ' + newUserResetPassword.email);
            return res.redirect(`/reset-password/otp/${newUserResetPassword.accessToken}`);
            
            
        } else {
            req.flash('error', 'User not found for this Email-ID!');
            return res.redirect('back');
        }
    } catch(err){
        console.log(err);
        req.flash('error', 'Server Error while getting User for this Email-ID!');
        return res.redirect('back');
    }
};