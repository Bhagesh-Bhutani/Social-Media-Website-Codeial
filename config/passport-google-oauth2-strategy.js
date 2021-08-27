const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '408135604979-t0qdk049vhlctr2je4fnb514u89620tn.apps.googleusercontent.com',
    clientSecret: 'TrLBrC9Ho9frp3302-9Z35hu',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
}, function(accessToken, requestToken, profile, done){
    User.findOne({
        email: profile.emails[0].value
    }, async function(err, user){
        if(err){
            console.log("Error in google strategy-passport", err);
            return;
        }

        console.log(profile);

        if(user){
            // If found, set this user as req.user
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user);
        } else {
            // If not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex'),
                avatar: profile.photos[0].value
            }, function(err, user){
                if(err){
                    console.log("Error in crrating user", err);
                    return;
                }
                return done(null, user);
            });
        }
    });
}));

module.exports = passport;