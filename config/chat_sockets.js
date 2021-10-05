const Message = require('../models/message');
const OnlineUser = require('../models/online_user');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });
    io.sockets.on('connection', async function(socket){
        console.log("New connection received: ", socket.id);

        socket.on('database-entry', async function(data){
            try{
                console.log(data);
                await OnlineUser.create({
                    user_id: data.user_id,
                    socket_id: socket.id
                });
            } catch(err){
                console.log(err);
            }
        });

        socket.on('disconnect', async function(){
            try{
                await OnlineUser.findOneAndDelete({
                    socket_id: socket.id
                });
                console.log('Socket disconnected! ', socket.id);
            } catch(err){
                console.log(err);
            }
        });

        socket.on('send-message', async function(data){
            console.log(data);
            let receiverSocketID = await OnlineUser.findOne({
                user_id: data.receiverID
            });

            console.log(receiverSocketID);
            if(receiverSocketID){
                console.log("YES");
                io.to(receiverSocketID.socket_id).emit('receive-message', {
                    sender_id: data.senderID,
                    message: data.message
                });
            }
        });
    });
};