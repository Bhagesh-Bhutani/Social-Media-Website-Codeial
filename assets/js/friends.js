let friendAjaxHandler = function(url, typeOfReq, element){
    $.ajax({
        type: typeOfReq,
        url: url,
        success: function(data){
            element.remove();
            successNotification(data);
        },
        error: function(data){
            errorNotification(data.responseJSON, "Internal Server Error!");
        }
    });
};

$('main').on('click', '.action-button', function(event){
    if(event.target.tagName == 'I'){
        event.target = event.target.parentElement;
    }
    let profileUserId = event.target.getAttribute('data-user-id');
    let opId = event.target.getAttribute('id');
    console.log(opId);
    let element = event.target.parentElement.parentElement.parentElement;
    if(opId == 'remove'){
        friendAjaxHandler(`/friend-request/remove-friend/${profileUserId}`, 'delete', element);
    }
});