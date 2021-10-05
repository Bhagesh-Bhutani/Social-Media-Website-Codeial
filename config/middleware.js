const FriendRequest = require('../models/friend_request');

module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    };
    return next();
};

module.exports.setFriendRequestUsers = async function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    let friendRequests = await FriendRequest.find({
        to_user: req.user._id
    });

    let friendRequestUsers = await Promise.all(friendRequests.map(async function(friendRequest){
        let tempRequest = await friendRequest.populate('from_user').execPopulate();
        return tempRequest.from_user;
    }));

    res.locals.friendRequestUsers = friendRequestUsers;
    return next();
};