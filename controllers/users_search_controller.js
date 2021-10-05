const User = require('../models/user');

module.exports.searchUsers = async function(req, res){
    try{
        if(req.query.text.length == 0){
            return res.status(200).json({
                data: {
                    usersList: []
                },
                message: "Search Results Rendered"
            });
        }
        let usersList = await User.find({
            name: {
                $regex: req.query.text,
                $options: 'i'
            }
        }).select(['_id', 'name', 'avatar']);

        return res.status(200).json({
            data: {
                usersList: usersList
            },
            message: "Search Results Rendered"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Server Error while Searching"
        });
    }
};