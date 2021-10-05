const User = require('../models/user');
const TempUser = require('../models/temp_user');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const queue = require('../workers/otp_create_user_email_worker');

// for get request at /signup
module.exports.sign_up_action = function(req, res){
    return res.render('user_sign_up', {
        title: "Sign Up!"
    });
};

// for post request at /signup and create a user
module.exports.createTempUser = async function(req, res){
    try{
        // Check if password and confirm password are same or not
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Password and Confirm Password do not Match!');
            return res.redirect('back');
        }

        let user = await User.findOne({
            email: req.body.email
        });

        if(user){
            console.log("User already exists");
            req.flash('error', 'This email already exists!');
            return res.redirect('back');
        }
        // Here user does not exist, so create TempUser
        let oldTempUser = await TempUser.findOne({
            email: req.body.email
        });
        
        if(oldTempUser){
            await oldTempUser.remove();
        }
        let tempUser = await TempUser.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            accessToken: crypto.randomBytes(20).toString('hex'),
            otp: otpGenerator.generate(6, {
                alphabets: false,
                upperCase: false,
                specialChars: false
            })
        });

        let job = queue.create('otp_create_user', tempUser).priority('high').save(function(err){
            if(err){
                console.log("Error while creating otp_create_user job", err);
                return;
            }
            console.log(job.id);
        });
        console.log("Created TempUser:", tempUser);
        return res.redirect(`/signup/otp/${tempUser.accessToken}`);

    } catch(err){
        console.log(err);
        return;
    }
};