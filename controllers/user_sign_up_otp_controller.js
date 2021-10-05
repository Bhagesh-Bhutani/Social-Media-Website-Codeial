const User = require('../models/user');
const TempUser = require('../models/temp_user');

module.exports.getOTPPageCreateUser = async function(req, res){
    try{
        let tempUser = await TempUser.findOne({
            accessToken: req.params.accessToken
        });

        if(tempUser){
            return res.render('create_user_otp', {
                title: 'Create Account | Enter OTP',
                tempUser: tempUser
            });
        }

        return res.redirect('back');
    } catch(err){
        console.log(err);
        req.flash('error', 'Internal Server Error. Try Later!');
        return res.redirect('back');
    }
};

module.exports.createUser = async function(req, res){
    try{
        let tempUser = await TempUser.findOne({
            accessToken: req.params.accessToken
        });
    
        if(tempUser){
            if(req.body.otp == tempUser.otp){
                // TODO : Create user as OTP is validated
                let user = await User.create({
                    email: tempUser.email,
                    password: tempUser.password,
                    name: tempUser.name,
                });

                await tempUser.remove();
                req.flash('success', 'User Created Successfully!');
                return res.redirect('/signin');
            } else {
                req.flash('error', 'Invalid OTP!');
                return res.redirect('back');
            }
        }
    
        return res.redirect('/signup');
    } catch(err){
        console.log(err);
        req.flash('error', 'Internal Server Error. Try Later!');
        return res.redirect('back');
    }
};