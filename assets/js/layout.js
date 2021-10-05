// M.AutoInit();
function materializeInit(){
    M.AutoInit();
}

materializeInit();

// Notification Functions
let successNotification = function(data){
    new Noty({
        text: data.message,
        layout: 'topRight',
        theme: 'relax',
        type: 'success',
        timeout: 2500
    }).show();
};

let errorNotification = function(data, defaultMessage){
    new Noty({
        text: data.message || defaultMessage,
        layout: 'topRight',
        theme: 'relax',
        type: 'error',
        timeout: 2500
    }).show();
};

let ringtonePlay = function(){
    let audio = new Audio('/music/ringtone.mp3');
    audio.play();
};

$('#friend-request').on('click', function(event){
    $('#friend-request-dropdown').toggle(200);
});

// $(document).on('click', function(event){
//     if(event.target.getAttribute('id') != 'friend-request' && event.target.getAttribute('id') != 'friend-request-icon' && $('#friend-request-dropdown').css('display') == 'block'){
//         $('#friend-request-dropdown').hide(200);
//     }
// });

let friendRequestHandler = function(url, li){
    $.ajax({
        type: 'put',
        url: url,
        success: function(data){
            successNotification(data);
            li.remove();
        },
        error: function(data){
            errorNotification(data.responseJSON, "Rejected Friend Request");
        }
    });
};

$('.sign-container').on('click', '.accept-friend-request-icon', function(event){
    let li = event.target.parentElement.parentElement;
    friendRequestHandler(`/friend-request/accept/${li.getAttribute('data-friend-id')}`, li);
});

$('.sign-container').on('click', '.reject-friend-request-icon', function(event){
    let li = event.target.parentElement.parentElement;
    friendRequestHandler(`/friend-request/reject/${li.getAttribute('data-friend-id')}`, li);
});

let searchUserli = function(user){
    return `
        <a href = "/users/profile/${user._id}" class = "collection-item">
            <li class = "search-result">
                <img src = "${user.avatar}" alt="" class="circle responsive-img friend-img">
                <div class="black-text">
                    ${user.name}
                </div>
            </li>
        </a>
    `;
};

let searchAjaxHandler = function(url){
    let searchBar = $('#search-bar');
    $.ajax({
        type: 'get',
        url: url,
        success: function(data){
            // Render results under search bar
            $('#search-bar-dropdown').empty();
            $('#search-bar-dropdown').offset({
                left: searchBar.offset().left,
                top: searchBar.offset().top + $('#search-bar').outerHeight()
            });
            if(data.data.usersList.length > 0){
                $('#search-bar-dropdown').css('visibility', 'visible');
                for(let i=0;i<Math.min(data.data.usersList.length, 8);i++){
                    let user = data.data.usersList[i];
                    $('#search-bar-dropdown').append(searchUserli(user));
                }
            } else {
                $('#search-bar-dropdown').css('visibility', 'hidden');
            }
        },
        error: function(data){
            errorNotification(data.responseJSON, "Search Failed - Server Error");
        }
    });
}

$('#search-bar').on('keyup', function(event){
    let text = event.target.value;
    searchAjaxHandler(`/users/search/?text=${text}`);
});

window.addEventListener('resize', function(event){
    $('#search-bar-dropdown').offset({
        left: $('#search-bar').offset().left,
        top: $('#search-bar').offset().top + $('#search-bar').outerHeight()
    });
    $('#search-bar-dropdown').css('width', $('#search-bar').outerWidth());
    console.log($('#search-bar').outerWidth());
});

$('#search-bar-dropdown').offset({
    left: $('#search-bar').offset().left,
    top: $('#search-bar').offset().top + $('#search-bar').outerHeight()
});

$('#search-bar-dropdown').css('width', $('#search-bar').outerWidth());
$('#search-bar-dropdown').css('visibility', 'hidden');