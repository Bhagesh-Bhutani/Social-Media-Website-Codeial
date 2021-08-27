const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
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

        return res.status(200).json({
            data: {
                posts: posts
            },
            message: "List of Posts"
        });
    } catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// /posts/destroy/:id
module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            await post.remove();
            await Comment.deleteMany({
                post: post._id
            });
            return res.status(200).json({
                message: "Post and associated comments deleted successfully!"
            });
        } else {
            return res.status(401).json({
                message: "Unauthorised user trying to delete someone else's post"
            });
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};