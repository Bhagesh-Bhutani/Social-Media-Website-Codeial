const User = require('../models/user');

module.exports.getProfile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log("Error while finding user for profile page.");
            return;
        }
        return res.render('user_profile', {
            title: user.name + ' | Profile',
            profile_user: user
        });
    });
};