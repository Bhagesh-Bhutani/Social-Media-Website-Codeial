const Post = require('../../../models/post');

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