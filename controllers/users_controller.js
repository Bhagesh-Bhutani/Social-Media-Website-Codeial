const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
// Here the thing to remember is that each time we require passport,
// no new instance is created, node.js preserves the instance from the beginning
// which optimises things, and which preserves the keys we defined in passport
// which correspond to middlewares we defined in passport-local-strategy.js module

module.exports.users_action = function(req, res){
    // We know that user is Authenticated, hence req.user exists
    Post.find({}, async function(err, posts){
        if(err){
            console.log("Error while finding all posts.");
            return;
        }

        for(post of posts){
            let user = await User.findById(post.user);
            post['user_object'] = user;
        }
        posts.sort(function(p1, p2){
            if(p1 > p2){
                return -1;
            } else if(p1 < p2){
                return 1;
            } else {
                return 0;
            }
        });
        return res.render('user_profile', {
            title: "User Profile",
            posts: posts
        });
    });
    
};

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
}