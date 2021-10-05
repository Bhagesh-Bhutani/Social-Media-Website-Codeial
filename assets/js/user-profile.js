$('.materialboxed').materialbox();

let friendAjaxHandler = function(url, typeOfReq, appendHtml){
    $.ajax({
        type: typeOfReq,
        url: url,
        success: function(data){
            $('.action-buttons').empty();
            $('.action-buttons').append(appendHtml);
            successNotification(data);
        },
        error: function(data){
            errorNotification(data.responseJSON, "Internal Server Error!");
        }
    });
};

let friendAjaxPostHandler = function(url, data, appendHtml){
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function(data){
            $('.action-buttons').empty();
            $('.action-buttons').append(appendHtml);
            successNotification(data);
        },
        error: function(data){
            errorNotification(data.responseJSON, "Internal Server Error!");
        }
    });
}

$('main').on('click', '.action-button', function(event){
    if(event.target.tagName == 'I'){
        event.target = event.target.parentElement;
    }
    let profileUserId = event.target.getAttribute('data-user-id');
    let opId = event.target.getAttribute('id');
    console.log(opId);
    if(opId == 'connect'){
        let data = {
            friendId: profileUserId
        };
        let appendHtml = `
            <div id = "withdraw" class = "action-button" data-user-id = "${profileUserId}">
                Withdraw Request
            </div>
        `;
        friendAjaxPostHandler('/friend-request/send', data, appendHtml);
    } else if(opId == 'accept'){
        let appendHtml = `
            <div id = "remove" class = "action-button" data-user-id = "${profileUserId}">
                Remove Friend <i class="fas fa-user-minus"></i>
            </div>
        `;
        friendAjaxHandler(`/friend-request/accept/${profileUserId}`, 'put', appendHtml);
    } else if(opId == 'reject'){
        let appendHtml = `
            <div id = "connect" class = "action-button" data-user-id = "${profileUserId}">
                Connect <i class="fas fa-plus"></i>
            </div>
        `;
        friendAjaxHandler(`/friend-request/reject/${profileUserId}`, 'put', appendHtml);
    } else if(opId == 'remove'){
        let appendHtml = `
            <div id = "connect" class = "action-button" data-user-id = "${profileUserId}">
                Connect <i class="fas fa-plus"></i>
            </div>
        `;
        friendAjaxHandler(`/friend-request/remove-friend/${profileUserId}`, 'delete', appendHtml);
    } else if(opId == 'withdraw'){
        let appendHtml = `
            <div id = "connect" class = "action-button" data-user-id = "${profileUserId}">
                Connect <i class="fas fa-plus"></i>
            </div>
        `;
        friendAjaxHandler(`/friend-request/withdraw/${profileUserId}`, 'put', appendHtml);
    }
});