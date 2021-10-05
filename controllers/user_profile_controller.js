const User = require('../models/user');
const FriendRequest = require('../models/friend_request');

module.exports.getProfile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        let sentFriendRequest = await FriendRequest.findOne({
            from_user: req.user._id,
            to_user: user._id
        });
        if(sentFriendRequest){
            return res.render('user_profile', {
                title: user.name + ' | Profile',
                profile_user: user,
                sentFriendRequest: sentFriendRequest
            });
        }

        let receivedFriendRequest = await FriendRequest.findOne({
            from_user: user._id,
            to_user: req.user._id
        });
        if(receivedFriendRequest){
            return res.render('user_profile', {
                title: user.name + ' | Profile',
                profile_user: user,
                receivedFriendRequest: receivedFriendRequest
            });
        }
        
        return res.render('user_profile', {
            title: user.name + ' | Profile',
            profile_user: user
        });
    } catch(err){
        console.log("Error while finding user for profile page.");
        return;
    }
};