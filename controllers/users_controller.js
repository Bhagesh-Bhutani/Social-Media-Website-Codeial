const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
// Here the thing to remember is that each time we require passport,
// no new instance is created, node.js preserves the instance from the beginning
// which optimises things, and which preserves the keys we defined in passport
// which correspond to middlewares we defined in passport-local-strategy.js module

module.exports.users_action = async function(req, res){
    // We know that user is Authenticated, hence req.user exists
    // populate function populates the user reference id to its corresponding object in User Model
    try{
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        posts.sort(function(p1, p2){
            if(p1.updatedAt > p2.updatedAt){
                return -1;
            } else if(p1.updatedAt < p2.updatedAt){
                return 1;
            } else {
                return 0;
            }
        });
            
        return res.render('feed',{
            title: "Feed",
            posts: posts
        });
    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error.");
    }
};

module.exports.destroySession = function(req, res){
    req.flash('success', 'You have logged out');
    req.logout();
    return res.redirect('/');
}

module.exports.getUpdateUserPage = async function(req, res){
    try{
        let user = await User.findById(req.user._id);
        return res.render('update_profile', {
            title: user.name + ' | Update Profile',
        });
    } catch(err){
        console.log(err);
        return res.status(404).send('This user not found');
    }
};

module.exports.updateUser = async function(req, res){
    try{
        await User.findByIdAndUpdate(req.user._id, req.body);
        return res.redirect('back');
    } catch(err){
        console.log(err);
        res.status(404).send("This user not found.");
    }
}