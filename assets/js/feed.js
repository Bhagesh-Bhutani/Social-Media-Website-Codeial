// For scroll to top button
let scroll_to_top_btn = document.getElementById('scroll-to-top-btn');

window.addEventListener('scroll', function(event){
    if(document.documentElement.scrollTop > 50){
        scroll_to_top_btn.classList.add('fade-opacity');
        scroll_to_top_btn.classList.remove('transparent-opacity');
    } else {
        scroll_to_top_btn.classList.remove('fade-opacity');
        scroll_to_top_btn.classList.add('transparent-opacity');
    }
});

scroll_to_top_btn.addEventListener('click', function(event){
    document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// For submitting post form via AJAX

let newPostForm = $('#new-post-form');

let createPost = function(post){
    return $(`
    <div class = "post card" id = "${post._id}">
        <div class = "user-intro">
            <a href="/users/profile/${post.user._id}" class = "post-user-image-container">
                <div>
                    <img class = "circle responsive-img user-image" src = "${post.user.avatar}">
                </div>
                <div class = "user-name-time-container">
                    <h5>${post.user.name}</h5>
                    <p class = "#e0e0e0 grey-text lighten-2 post-time"><i class="fas fa-globe"></i> ${post.createdAt.toString().substring(0,25)}</p>
                </div>
            </a>
            
            <div>
                <i class="fas fa-edit post-dropdown-btn dropdown-trigger waves-effect" data-target = "dropdown-${ post._id }"></i>
                <ul id = "dropdown-${ post._id }" class = "dropdown-content">
                    <li><a href="/posts/destroy/${ post._id }" class = "post-delete-link" data-postID = "${ post._id }">Delete</a></li>
                </ul>
            </div>
        </div>
        
        <hr>
        <div class = "post-content">
            ${ post.content } 
        </div>
        <div class = "like-comment-numbers">
            <div class = "like-numbers">
                <span class = "like-numbers-count">${ post.likes.length }</span> <i class="fas fa-thumbs-up filled-like-btn"></i>
            </div>
            <div class = "comment-numbers">
                <i class = "far fa-comment"></i> <span class = "comment-count">${ post.comments.length }</span>
            </div>
        </div>
        <div class = "like-comment-tab row" id = "like-comment-tab">
            <div class = "col xs6 s6 m6 l6 xl6 center-align waves-effect waves-blue like-btn">
                <i class = "far fa-thumbs-up"></i> Like
            </div>
            <div class = "col xs6 s6 m6 l6 xl6 center-align waves-effect waves-green comment-btn">
                <i class = "far fa-comment"></i> Comment
            </div>
        </div>
        <div class = "post-comments">
            <form action = "/comments/create" method = "POST" class = "create-comment">
                <div class = "input-field">
                    <input type = "text" name = "content" class = "comment-input-text" placeholder = "Add a comment..." required>
                </div>
                <input type = "hidden" name = "post" value = "${ post._id }">
                <button class="btn blue waves-effect waves-light" type="submit">Post
                    <i class="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </form>

            <div class = "comments-container">

            </div>
        </div>
    </div>
    `);
};

let newPostFormAction = function(event){
    event.preventDefault();

    $.ajax({
        type: 'post',
        url: '/posts/create',
        data: newPostForm.serialize(),
        success: function(data){
            $('#feed-posts-container').prepend(createPost(data.data.post));
            $('#content').val('');
            materializeInit();
            successNotification(data);
        },
        error: function(data){
            errorNotification(data, "Post Creation request could not be sent");
        }
    });
};

newPostForm.on('submit', newPostFormAction);

// For deletion of post
let deletePost = function(postID){
    $.ajax({
        type: 'get',
        url: `/posts/destroy/${postID}`,
        success: function(data){
            $(`#${postID}`).remove();
            successNotification(data);
        },
        error: function(data){
            errorNotification(data, "Post deletion request could not be sent");
        }
    });
};

$('#feed-posts-container').on('click', '.post-delete-link', function(event){
    event.preventDefault();
    deletePost(event.target.getAttribute('data-postID'));
});

// For Comment Creation
let createComment = function(comment){
    return `
    <div id = "${comment._id}" class = "comment">
        <a href="/users/profile/${comment.user._id}" class = "comment-image-container">
            <div>
                <img class = "circle responsive-img user-image" src = "${comment.user.avatar}">
            </div>
        </a>
        
        <div class = "comment-container">
            <div class = "comment-user-deletebtn-container">
                <a href="/users/profile/${comment.user._id}"><h6>${comment.user.name}</h6></a>
                <i class="comment-dropdown-btn fas fa-chevron-circle-down dropdown-trigger waves-effect" data-target = "dropdown-${comment._id}">
                </i>
                <ul id = "dropdown-${comment._id}" class = "dropdown-content">
                    <li><a href="/comments/destroy/${comment._id}" data-commentID = '${comment._id}' class = "comment-delete-link">Delete</a></li>
                </ul>
            </div>
            <p class = "comment-para">${comment.content}</p>
        </div>
    </div>
    `;
};

let incrementCounter = function(counter){
    counter.text(parseInt(counter.text()) + 1);
    anime({
        targets: counter.parent().get(0),
        direction: 'alternate',
        scale: 1.35,
        easing: 'easeInOutSine',
        duration: 200 
    });
}

let decrementCounter = function(counter){
    counter.text(parseInt(counter.text()) - 1);
    anime({
        targets: counter.parent().get(0),
        direction: 'alternate',
        scale: 1.35,
        easing: 'easeInOutSine',
        duration: 200
    });
}

let newCommentCreateAction = function(commentForm){
    $.ajax({
        type: 'post',
        url: '/comments/create',
        data: $(commentForm).serialize(),
        success: function(data){
            $(commentForm).parent().find('.comments-container').prepend(createComment(data.data.comment));
            $(commentForm).find('.comment-input-text').eq(0).val('');
            materializeInit();
            incrementCounter($(commentForm).parent().parent().find('.comment-count'));
            successNotification(data);
        },
        error: function(data){
            errorNotification(data, "Comment creation request could not be sent");
        }
    });
}

$('#feed-posts-container').on('submit', '.create-comment', function(event){
    event.preventDefault();
    newCommentCreateAction(event.target);
});

// For Comment Deletion
let deleteComment = function(commentID, commentDeleteLink){
    let commentCounter = $(commentDeleteLink).parent().parent().parent().parent().parent().parent().parent().parent().find('.comment-count');
    $.ajax({
        type: 'get',
        url: `/comments/destroy/${commentID}`,
        success: function(data){
            $(`#${commentID}`).remove();
            decrementCounter(commentCounter);
            successNotification(data);
        },
        error: function(data){
            errorNotification(data, "Comment Deletion request could not be sent");
        }
    });
}

$('#feed-posts-container').on('click', '.comment-delete-link', function(event){
    event.preventDefault();
    let commentID = event.target.getAttribute('data-commentID');
    deleteComment(commentID, event.target);
});

let likePost = function(likedPost){
    $.ajax({
        type: 'put',
        url: `/likes/toggle?type=Post&id=${likedPost.attr('id')}`,
        success: function(data){
            // successNotification(data);
        },
        error: function(data){
            errorNotification(data, "Internal Server Error!");
        }
    });
};

$('#feed-posts-container').on('click', '.like-btn', function(event){
    if(event.target.tagName == 'I'){
        event.target = event.target.parentElement;
    }
    let likeCounter = $(event.target).parent().parent().find('.like-numbers-count');
    let likeIcon = $(event.target).find('i');
    let likedPost = $(event.target).parent().parent();
    if($(event.target).hasClass('liked')){
        likeCounter.text(parseInt(likeCounter.text()) - 1);
        $(event.target).removeClass('liked');
        likeIcon.removeClass('fas');
        likeIcon.addClass('far');
    } else {
        likeCounter.text(parseInt(likeCounter.text()) + 1);
        $(event.target).addClass('liked');
        likeIcon.removeClass('far');
        likeIcon.addClass('fas');        
    }
    anime({
        targets: event.target.querySelector('i'),
        direction: 'alternate',
        scale: 1.35,
        easing: 'easeInOutSine',
        duration: 200
    });
    likePost(likedPost);
});