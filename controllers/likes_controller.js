const Post = require('../models/post');
const Like = require('../models/like');

// Route: /likes/toggle?type=Post&id=<id of post/comment>
// query params will be type(Post or Comment) and id of Post or Comment
// PUT request
module.exports.toggleLike = async function(req, res){
    let like = await Like.findOne({
        onModel: req.query.type,
        likeable: req.query.id,
        user: req.user._id
    });

    let likeable;
    if(req.query.type == 'Post'){
        // Post
        likeable = await Post.findById(req.query.id);
    } else {
        // Comment
        likeable = await Comment.findById(req.query.id);
    }

    if(!likeable){
        return res.status(404).json({
            message: "Post or Comment for this id not found!"
        });
    }

    if(like){
        likeable.likes.pull(like._id);
        await likeable.save();
        await like.remove();
        return res.status(200).json({
            message: `Unliked ${req.query.type}!`
        });
    } else {
        let createLike = await Like.create({
            user: req.user._id,
            likeable: likeable._id,
            onModel: req.query.type
        });
        likeable.likes.push(createLike._id);
        await likeable.save();
        return res.status(200).json({
            message: `Liked ${req.query.type}!`
        });
    }
};