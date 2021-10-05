const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
// const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../workers/comment_email_worker');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        let comment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: post._id
        });

        post.comments.push(comment._id);
        await post.save(); // save function to tell the database to update this document with this object
        comment = await comment.populate('user').execPopulate();
        // commentsMailer.newComment(comment);
        // Using the kue queue for emails instead
        let job = queue.create('emails', comment).priority('low').save(function(err){
            if(err){
                console.log("Error while creating emails job", err);
                return;
            }
            console.log(job.id);
        });

        if(req.xhr){
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
            await comment.remove();
            await Post.findByIdAndUpdate(postID, {
                $pull: {
                    comments: req.params.id
                }
            });
            await Like.deleteMany({
                onModel: 'Comment',
                likeable: comment._id
            });
            if(req.xhr){
                return res.status(200).json({
                    message: "Comment Deleted Successfully!"
                });
            }
            return res.redirect('back');
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