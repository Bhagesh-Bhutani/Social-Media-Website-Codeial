let contactsSearchHandler = function(text){
    $.ajax({
        type: 'get',
        url: `/chat/get-contacts/?text=${text}`,
        success: function(data){
            let usersList = data.data.usersList;
            $('.contacts-list').empty();
            for(user of usersList){
                $('.contacts-list').append(`
                    <div class = "contact-item waves-effect waves-teal" data-contactID = "${user._id}">
                        <div class = "contact-name-image-container">
                            <div class = "contact-item-image">
                                <img src = "${user.avatar}" alt="" class = "circle responsive-img user-image">
                            </div>
                            <div class = "contact-item-name">
                                ${user.name}
                            </div>
                        </div>

                        <div class = "new-message-badge">

                        </div>
                    </div>
                `);
            }
        },
        error: function(data){
            console.log(data.message);
        }
    });
};

$('#contacts-search-bar').on('keyup', function(event){
    let text = event.target.value;
    contactsSearchHandler(text);
});

let contactClickAJAXHandler = function(contactItem){
    let contactID = contactItem.attr('data-contactID');
    $.ajax({
        type: 'get',
        url: `/chat/fetch-user/?id=${contactID}`,
        success: function(data){
            contactItem.addClass('active-chat-contact');
            $('.contact-image').empty();
            $('.contact-image').append(`
                <img src = "${data.data.user.avatar}" alt = "" class = "circle responsive-img user-image">
            `);
            $('.contact-name').text(data.data.user.name);
            $('.messages-container').attr('data-contactID' , data.data.user._id);
            $('.contact-messages').empty();

            for(message of data.data.messageList){
                let messageClass;
                if(message.to == contactID){
                    messageClass = 'sender-message'
                } else {
                    messageClass = 'receiver-message';
                }
                if(messageClass == 'sender-message'){
                    $('.contact-messages').append(`
                        <div class = "message">
                            <div class = "col xs0 s1 m2 l3 xl3">

                            </div>
                            <div class = "${messageClass}">
                                ${message.content}
                            </div>
                        </div>
                    `);
                } else {
                    $('.contact-messages').append(`
                        <div class = "message">
                            <div class = "${messageClass}">
                                ${message.content}
                            </div>
                            <div class = "col xs0 s1 m2 l3 xl3">

                            </div>
                        </div>
                    `);
                }
            }

            $('.contact-messages').scrollTop($('.contact-messages')[0].scrollHeight);
            contactItem.children('.new-message-badge').empty();
        },
        error: function(data){
            console.log("Error while fetching user");
        }
    });
};

let contactClickHandler = function(contactItem){
    for(contact of $('.contacts-list').children()){
        if($(contact).hasClass('active-chat-contact')){
            $(contact).removeClass('active-chat-contact');
            break;
        }
    }

    contactClickAJAXHandler(contactItem);
};

$('.contacts-list').on('click', '.contact-item', function(event){
    let contactItem = $(this);
    if(contactItem.hasClass('active-chat-contact') == false){
        contactClickHandler(contactItem);
    }
});

let messageSenderHandler = function(contactID, message){
    $.ajax({
        type: 'post',
        url: '/chat/create-message',
        data: {
            from: ChatEngine.userID,
            to: contactID,
            message: message
        },
        success: function(data){
            ChatEngine.messageSenderEventEmitter(contactID, message);
            $($('.message-field-input')[0]).val('');
            $('.contact-messages').append(`
                <div class = "message">
                    <div class = "col xs0 s1 m2 l3 xl3">

                    </div>
                    <div class = "sender-message">
                        ${message}
                    </div>
                </div>
            `);

            $('.contact-messages').scrollTop($('.contact-messages')[0].scrollHeight);
        },
        error: function(data){
            errorNotification(data.responseJSON, 'Error while creating message');
        }
    });
};

$('.message-field').on('submit', function(event){
    event.preventDefault();
    let message = $($('.message-field-input')[0]).val();
    let contactID = event.target.parentElement.getAttribute('data-contactID');
    if(contactID == ''){
        errorNotification({}, 'Select a User First!');
    } else {
        messageSenderHandler(contactID, message);
    }
});