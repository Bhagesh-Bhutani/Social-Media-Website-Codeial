const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('./environment');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
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