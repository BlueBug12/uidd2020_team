$(document).on('mouseenter', '#UserImg', function () {
    $(this).css('border-color','#D0D9DC');
    }).on('mouseleave', '#UserImg', function () {
    $(this).css('border-color','#789FB3');
    });
  let span_menu=0;
$(document).on('click', '#UserImg', function () {
    if(!span_menu){
        $('.menubar').css('visibility','visible');
        span_menu=1;
    }
    else{
        $('.menubar').css('visibility','hidden');
        span_menu=0;
    }
});
//click region except menubar
$(document).mouseup(function(e){
    var _con = $('.menubar'); 
    if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
      $('.menubar').css('visibility','hidden');
      span_menu=0;
    }
  });
$(document).on('mouseenter', '.menubar', function () {
    $(this).css('background','#d6dde4');
    }).on('mouseleave', '.menubar', function () {
    $(this).css('background','#b8bec4');
    });
$(document).on('click',"#bar2",function(){
    localStorage.clear();
})


let bannerbuttons = document.getElementsByClassName('bannerbutton');
    bannerbuttons[0].classList.add('active');
    for (let i = 0; i < bannerbuttons.length; i++) {
        bannerbuttons[i].addEventListener('click', function(e) {
            for (let i = 0; i < bannerbuttons.length; i++) {
                bannerbuttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }