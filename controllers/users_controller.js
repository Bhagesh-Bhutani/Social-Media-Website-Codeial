const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
// Here the thing to remember is that each time we require passport,
// no new instance is created, node.js preserves the instance from the beginning
// which optimises things, and which preserves the keys we defined in passport
// which correspond to middlewares we defined in passport-local-strategy.js module

module.exports.users_action = function(req, res){
    // We know that user is Authenticated, hence req.user exists
    // populate function populates the user reference id to its corresponding object in User Model
    Post.find({}).populate('user').exec(function(err, posts){
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
    });
};

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
}