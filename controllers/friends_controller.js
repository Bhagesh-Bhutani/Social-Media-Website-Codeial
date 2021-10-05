const User = require('../models/user');

// Route: /friends
// GET
module.exports.friendList = async function(req, res){
    try{
        let user = await req.user.populate({
            path: 'friends'
        }).execPopulate();
    
        let friends = user.friends;
        return res.render('friends', {
            title: `${req.user.name} | Friends`,
            friends: friends
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
};