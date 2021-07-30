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