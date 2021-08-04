const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        let comment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: post._id
        });
        post.comments.push(comment._id);
        post.save(); // save function to tell the database to update this document with this object
        if(req.xhr){
            comment = await comment.populate('user').execPopulate();
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment Created Successfully!"
            });
        }
        return res.redirect('back');
    } catch(err){
        console.log(err);
        return;
    }
};

// /comments/destroy/:id
module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postID = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postID, {
                $pull: {
                    comments: req.params.id
                }
            });
            if(req.xhr){
                return res.status(200).json({
                    message: "Comment Deleted Successfully!"
                });
            }
            res.redirect('back');
        } else {
            if(req.xhr){
                return res.status(401).json({
                    message: "You are trying to delete someone else's comment!"
                });
            }
            return res.redirect('back');
        }
    } catch(err){
        console.log(err);
        return;
    }
};