$(document).ready(function() {
  console.log("hello");


    let bannerbuttons = document.getElementsByClassName('bannerbutton');
    console.log(bannerbuttons);
    bannerbuttons[0].classList.add('active');


    for (let i = 0; i < bannerbuttons.length; i++) {
        bannerbuttons[i].addEventListener('click', function(e) {
            for (let i = 0; i < bannerbuttons.length; i++) {
                bannerbuttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }
    $( function() {
      $( "#datepicker" ).datepicker({
        showOtherMonths: true,
        selectOtherMonths: true
      });
    });

    $(document).on('mouseenter', '#send_button', function () {
      $(this).css('background','#799FB4').css('color','#F7F6E4');
  	}).on('mouseleave', '#send_button', function () {
      $(this).css('background','#D0D9DC').css('color','black');
  	});

    $(document).on('mouseenter', '#switch_data', function () {
      $(this).css('opacity',0.75);
  	}).on('mouseleave', '#switch_data', function () {
      $(this).css('opacity',1);
  	});

    $(document).on('mouseenter', '#user', function () {
      $(this).css('border-color','#D0D9DC');
  	}).on('mouseleave', '#user', function () {
      $(this).css('border-color','#789FB3');
  	});
    let span_menu=0;
    $(document).on('click', '#user', function () {
      if(!span_menu){
        $('.menubar').css('visibility','visible');
        span_menu=1;
      }
      else{
        $('.menubar').css('visibility','hidden');
        span_menu=0;
      }
  	});

    $(document).on('mouseenter', '.menubar', function () {
      $(this).css('background','#d6dde4');
  	}).on('mouseleave', '.menubar', function () {
      $(this).css('background','#b8bec4');
  	});

    $(document).on('click', '#bar1', function () {

  	});
    $(document).on('click', '#bar2', function () {

    });
    let tri=0;
    $(document).on('click','#switch_data',function(){
      if(!tri){
        document.getElementById('data_bar').textContent='我的足跡';
        $('#left_data').css('visibility','hidden');
        $('#upload_img').css('visibility','hidden');
        document.getElementById('switch_data').classList.remove('triangle');
        document.getElementById('switch_data').classList.add('anti-triangle');
        tri=1;
      }
      else{
        document.getElementById('data_bar').textContent='我的檔案';
        $('#left_data').css('visibility','visible');
        $('#upload_img').css('visibility','visible');
        document.getElementById('switch_data').classList.remove('anti-triangle');
        document.getElementById('switch_data').classList.add('triangle');
        tri=0;
      }

    });
  });

function getUser() {
    var account = localStorage.getItem("account");
    $.get('./users/find/' + account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
        localStorage.setItem("classcode", res.classcode);
    });
}
