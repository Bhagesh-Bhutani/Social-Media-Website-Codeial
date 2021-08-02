const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // To detect whether the request is AJAX request
        if(req.xhr){
            post = await post.populate('user').execPopulate();
            console.log(post.createdAt);
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created!"
            });
        }

        res.redirect('back');
    } catch(err){
        console.log(err);
        return;
    }
}

// /posts/destroy/:id
module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({
                post: post._id
            });
            return res.redirect('back');
        } else {
            console.log("Invalid user trying to delete someone else's post.");
            return res.status(401).send("Unauthorised user trying to delete someone else's post.");
        }
    } catch(err){
        console.log(err);
        return;
    }
}