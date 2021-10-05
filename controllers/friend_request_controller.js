const User = require('../models/user');
const FriendRequest = require('../models/friend_request');

// Route: /friend-request/send
// POST

module.exports.sendFriendRequest = async function(req, res){
    try{
        // Check whether request exists
        let existingSentRequest = await FriendRequest.findOne({
            from_user: req.user._id,
            to_user: req.body.friendId
        });

        if(existingSentRequest){
            return res.status(500).json({
                message: "Cannot send the request to the same user again!"
            });
        }

        let existingReceivedRequest = await FriendRequest.findOne({
            from_user: req.body.friendId,
            to_user: req.user._id
        });

        if(existingReceivedRequest){
            return res.status(500).json({
                message: "You received a friend request from this user, cannot send friend request to this user!"
            });
        }

        // First verify whether the other user exists or not
        let requestedUser = await User.findById(req.body.friendId);
        if(!requestedUser){
            return res.status(404).json({
                message: "Requested user not found!"
            });
        }

        // Now friend request can be sent
        await FriendRequest.create({
            from_user: req.user._id,
            to_user: req.body.friendId
        });

        return res.status(200).json({
            message: "Friend Request Sent!"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};

// Route: /friend-request/accept/:friendId
// PUT

module.exports.acceptFriendRequest = async function(req, res){
    try{
        let friendRequest = await FriendRequest.findOne({
            from_user: req.params.friendId,
            to_user: req.user._id
        });
    
        if(!friendRequest){
            return res.status(500).json({
                message: "Cannot Accept Friend Request as Request not received"
            });
        }
    
        // Request is received, now add friends to both the users
        let sentUser = await User.findById(req.params.friendId);
        let receivedUser = await User.findById(req.user._id);
        let sentUserName = sentUser.name;
        sentUser.friends.push(receivedUser._id);
        receivedUser.friends.push(sentUser._id);
        await sentUser.save();
        await receivedUser.save();
        await friendRequest.remove();
    
        return res.status(200).json({
            message: `<strong>${sentUserName}</strong> added to Friends!`
        });   
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};

// Route: /friend-request/reject/:friendId
// PUT

module.exports.rejectFriendRequest = async function(req, res){
    try{
        let friendRequest = await FriendRequest.findOne({
            from_user: req.params.friendId,
            to_user: req.user._id
        });
    
        if(!friendRequest){
            return res.status(500).json({
                message: "Cannot Reject Friend Request as Request not Received"
            });
        }
    
        // Request is received, nowremove this request
        await friendRequest.remove();

        let fromUser = await User.findById(req.params.friendId);
    
        return res.status(200).json({
            message: `<strong>${fromUser.name}</strong>'s Request Rejected`
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};

// Route: /friend-request/withdraw/:friendId
// PUT

module.exports.withdrawFriendRequest = async function(req, res){
    try{
        let friendRequest = await FriendRequest.findOne({
            from_user: req.user._id,
            to_user: req.params.friendId
        });
    
        if(!friendRequest){
            return res.status(500).json({
                message: "Cannot Withdraw Friend Request as Request not Sent"
            });
        }
    
        await friendRequest.remove();
    
        return res.status(200).json({
            message: "Withdrawn Friend Request"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};

// Route: /friend-request/remove-friend/:friendId
// DELETE

module.exports.removeFriend = async function(req, res){
    try{
        if(req.user.friends.includes(req.params.friendId)){
            let requestedUser = await User.findById(req.params.friendId);
            if(!requestedUser){
                return res.status(404).json({
                    message: "Requested friend to be removed not found!"
                });
            }
            req.user.friends.pull(requestedUser._id);
            requestedUser.friends.pull(req.user._id);
            await req.user.save();
            await requestedUser.save();

            return res.status(200).json({
                message: "Friend Removed!"
            });
        }
    
        // Friend not found
        return res.status(500).json({
            message: "Friend Not Found!"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};