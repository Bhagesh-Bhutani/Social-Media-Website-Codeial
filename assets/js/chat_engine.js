class chatEngine{
    constructor(userID, userEmail){
        this.userID = userID;
        this.userEmail = userEmail;
        this.self = this;
        this.socket = io.connect('http://localhost:8000', {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });

        if(this.userEmail){
            this.connectionHandler();
        }

        this.socket.on('receive-message', function(data){
            console.log("Received");
            console.log(data);
            if($('.messages-container').attr('data-contactID') == data.sender_id){
                $('.contact-messages').append(`
                    <div class = "message">
                        <div class = "receiver-message">
                            ${data.message}
                        </div>
                        <div class = "col xs0 s1 m2 l3 xl3">

                        </div>
                    </div>
                `);

                $('.contact-messages').scrollTop($('.contact-messages')[0].scrollHeight);
            } else {
                for(let contactItem of $('.contact-item')){
                    if(contactItem.getAttribute('data-contactID') == data.sender_id){
                        $($(contactItem).children('.new-message-badge')).empty();
                        $($(contactItem).children('.new-message-badge')).append(`
                            <span class="new badge"></span>
                        `);
                        break;
                    }
                }
            }

            let audio = new Audio('/music/ringtone.mp3');
            audio.play();
        });
    }

    connectionHandler(){
        this.socket.on('connect', () => {
            console.log('Connection established using sockets');
            // here, this refers to socket as this binding of callback is to the object (this.socket) on which event listener was attached
            this.socket.emit('database-entry', {
                user_id: this.userID,
            });
        });
    }

    messageSenderEventEmitter(contactID, message){
        this.socket.emit('send-message', {
            senderID: this.userID,
            receiverID: contactID,
            message: message
        });
    }
};