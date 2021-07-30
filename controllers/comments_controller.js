const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log("Error while finding post of received comment.");
            return;
        }
        Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: post._id
        }, function(err, comment){
            if(err){
                console.log("Error while creating comment.");
                return;
            }
            // Push the comment in appropriate Post in Post Collection
            post.comments.push(comment._id);
            post.save(); // save function to tell the database to update this document with this object
            return res.redirect('back');
        });
    });
};

// /comments/destroy/:id
module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if(err){
            console.log("Error while finding comment to be deleted.");
            return;
        }
        if(comment.user == req.user.id){
            let postID = comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postID, {
                $pull: {
                    comments: req.params.id
                }
            }, function(err, post){
                if(err){
                    console.log("Error while updating comments array in post.");
                    return;
                }
                return res.redirect('back');
            });
        } else {
            return res.redirect('back');
        }
    });
};