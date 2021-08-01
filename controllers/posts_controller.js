const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
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