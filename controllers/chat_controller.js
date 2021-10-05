const User = require('../models/user');
const Message = require('../models/message');

// GET: /chat
module.exports.getChatPage = async function(req, res){
    try{
        await req.user.populate('friends').execPopulate();
        let usersList = req.user.friends;
        usersList = usersList.map(function(user){
            return {
                name: user.name,
                avatar: user.avatar,
                _id: user._id
            };
        });

        return res.render('chat', {
            title: 'Codeial | Chat',
            usersList: usersList
        });
    } catch(err){
        console.log(err);
        return res.status(500).send("Error while getting Chat Page");
    }
};

// AJAX GET: /chat/get-contacts
module.exports.getContacts = async function(req, res){
    try{
        await req.user.populate('friends').execPopulate();
        let usersList = req.user.friends;
        usersList = usersList.map(function(user){
            return {
                name: user.name,
                avatar: user.avatar,
                _id: user._id
            };
        });
        usersList = usersList.filter(function(user){
            return user.name.toLowerCase().includes(req.query.text.toLowerCase());
        });
        return res.status(200).json({
            data: {
                usersList: usersList
            },
            message: "Contacts Rendered"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Server Error while Searching"
        });
    }
};

// GET : /chat/fetch-user AJAX
module.exports.fetchUser = async function(req, res){
    try{
        let user = await User.findById(req.query.id);
        let messageList = await Message.find({
            $or: [
                {
                    from: req.user.id,
                    to: req.query.id
                },
                {
                    from: req.query.id,
                    to: req.user.id
                }
            ]
        })
        .sort('createdAt');
        return res.status(200).json({
            data: {
                user: user,
                messageList: messageList
            },
            message: "User fetched successfully"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Error while fetching user"
        });
    }
};

// POST : /chat/create-message AJAX
module.exports.createMessage = async function(req, res){
    try{
        await Message.create({
            from: req.user._id,
            to: req.body.to,
            content: req.body.message
        });

        return res.status(200).json({
            message: "Message sent"
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Error while creating message"
        });
    }
};