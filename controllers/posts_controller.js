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
            try{
                post = await post.populate('user').execPopulate();
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post Created Successfully!"
                });
            } catch(err){
                return res.status(500).json({
                    message: "Error while creating your post. Please Try Again!"
                });
            }
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
        if(req.xhr){
            if(post.user == req.user.id){
                await post.remove();
                await Comment.deleteMany({
                    post: post._id
                });
                return res.status(200).json({
                    message: "Post Deleted Successfully!"
                });
            } else {
                return res.status(401).json({
                    message: "You are trying to delete someone else's Post!"
                });
            }
        }
        if(post.user == req.user.id){
            await post.remove();
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