function materializeInit(){M.AutoInit()}materializeInit();let successNotification=function(e){new Noty({text:e.message,layout:"topRight",theme:"relax",type:"success",timeout:2500}).show()},errorNotification=function(e,t){new Noty({text:e.message||t,layout:"topRight",theme:"relax",type:"error",timeout:2500}).show()},ringtonePlay=function(){new Audio("/music/ringtone.mp3").play()};$("#friend-request").on("click",(function(e){$("#friend-request-dropdown").toggle(200)}));let friendRequestHandler=function(e,t){$.ajax({type:"put",url:e,success:function(e){successNotification(e),t.remove()},error:function(e){errorNotification(e.responseJSON,"Rejected Friend Request")}})};$(".sign-container").on("click",".accept-friend-request-icon",(function(e){let t=e.target.parentElement.parentElement;friendRequestHandler(`/friend-request/accept/${t.getAttribute("data-friend-id")}`,t)})),$(".sign-container").on("click",".reject-friend-request-icon",(function(e){let t=e.target.parentElement.parentElement;friendRequestHandler(`/friend-request/reject/${t.getAttribute("data-friend-id")}`,t)}));let searchUserli=function(e){return`\n        <a href = "/users/profile/${e._id}" class = "collection-item">\n            <li class = "search-result">\n                <img src = "${e.avatar}" alt="" class="circle responsive-img friend-img">\n                <div class="black-text">\n                    ${e.name}\n                </div>\n            </li>\n        </a>\n    `},searchAjaxHandler=function(e){let t=$("#search-bar");$.ajax({type:"get",url:e,success:function(e){if($("#search-bar-dropdown").empty(),$("#search-bar-dropdown").offset({left:t.offset().left,top:t.offset().top+$("#search-bar").outerHeight()}),e.data.usersList.length>0){$("#search-bar-dropdown").css("visibility","visible");for(let t=0;t<Math.min(e.data.usersList.length,8);t++){let r=e.data.usersList[t];$("#search-bar-dropdown").append(searchUserli(r))}}else $("#search-bar-dropdown").css("visibility","hidden")},error:function(e){errorNotification(e.responseJSON,"Search Failed - Server Error")}})};$("#search-bar").on("keyup",(function(e){let t=e.target.value;searchAjaxHandler(`/users/search/?text=${t}`)})),window.addEventListener("resize",(function(e){$("#search-bar-dropdown").offset({left:$("#search-bar").offset().left,top:$("#search-bar").offset().top+$("#search-bar").outerHeight()}),$("#search-bar-dropdown").css("width",$("#search-bar").outerWidth()),console.log($("#search-bar").outerWidth())})),$("#search-bar-dropdown").offset({left:$("#search-bar").offset().left,top:$("#search-bar").offset().top+$("#search-bar").outerHeight()}),$("#search-bar-dropdown").css("width",$("#search-bar").outerWidth()),$("#search-bar-dropdown").css("visibility","hidden");