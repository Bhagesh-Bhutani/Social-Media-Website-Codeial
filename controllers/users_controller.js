const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');
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
        .sort('-createdAt')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let likesPost = await Like.find({
            onModel: 'Post',
            user: req.user._id
        });

        posts.forEach(post => {
            post.comments.sort(function(c1, c2){
                if(c1.createdAt < c2.createdAt){
                    return 1;
                }
                if(c1.createdAt > c2.createdAt){
                    return -1;
                }
                return 0;
            });
        });
            
        return res.render('feed',{
            title: "Feed",
            posts: posts,
            likesPost: likesPost
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
        // await User.findByIdAndUpdate(req.user._id, req.body);
        let user = await User.findById(req.user._id);
        User.uploadedAvatar(req, res, async function(err){
            if(err){
                console.log(err);
                return;
            }
            user.name = req.body.name;
            user.email = req.body.email;
            
            if(req.file){
                if(user.avatar != '/images/default-user-image.png'){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }
                // save the path of file
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            await user.save();
            return res.redirect('back');
        });
    } catch(err){
        console.log(err);
        res.status(404).send("This user not found.");
    }
};

module.exports.redirectToFeed = function(req, res){
    return res.redirect('/users/feed');
};