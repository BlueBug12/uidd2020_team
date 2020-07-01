window.fbAsyncInit = function() {
  FB.init({
      appId: myAppId,
      xfbml: true,
      version: 'v7.0'
  });
  FB.AppEvents.logPageView();
};
// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
var img_url;
var user_name;
var user_gender;
var user_mail;
var user_birthday;

function error(type, str) {
  $(type + '-error').text(str);
  $(type).addClass('err');
}

function clear() {
  $('#name-error').text("");
  $('#datepicker-error').text("");
  $('#mail-error').text("");
  $('#name').removeClass('err');
  $('#datepicker').removeClass('err');
  $('#mail').removeClass('err');


}
function check() {
  clear();
  var english = /^[A-Za-z0-9]+$/;
  const correctmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const name = user_name;
  const datepicker = user_birthday;
  const mail = user_mail;
  let ans = true;


  if (datepicker==""){
      error("#datepicker", '此為必填欄位');
      ans = false;        
  }

  if (name == "") {
      error("#name", '此為必填欄位');
      ans = false;
  }

  if (mail == "") {
      error("#mail", '此為必填欄位');
      ans = false;
  } else {
      if (!correctmail.test(mail)) {
          error("#mail", '電子郵件無效');
          ans = false;
      }
  }

  return ans;

}

function buttonenable() {
  let buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
      buttons[i].style.cursor = "pointer";
  }
}

function hrefenable() {
  let hrefs = document.getElementsByTagName('a');
  for (let i = 0; i < hrefs.length; i++) {
      hrefs[i].style.cursor = "pointer";
      hrefs[i].style.pointerEvents = "auto";

  }
}

function buttonunable() {
  let buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      buttons[i].style.cursor = "default";
  }
  $('.checkconfirm').css("cursor", "pointer");
  $('.checkconfirm').prop("disabled", false);
}

function hrefunable() {
  let hrefs = document.getElementsByTagName('a');
  for (let i = 0; i < hrefs.length; i++) {
      hrefs[i].style.cursor = "default";
      hrefs[i].style.pointerEvents = "none";
  }
}

$(document).ready(function() {
  //console.log("hello");
  

    let bannerbuttons = document.getElementsByClassName('bannerbutton');
   // console.log(bannerbuttons);
   // bannerbuttons[0].classList.add('active');


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
    (function () {//upload img file
      var uploader = document.createElement('input'),
        image = document.getElementById('img-result');
        add_button = document.getElementById('upload_img');
      uploader.type = 'file';
      uploader.accept = 'image/*';

      add_button.onclick = function() {
        uploader.click();
      }

      uploader.onchange = function() {
        var reader = new FileReader();
        reader.onload = function(evt) {
          image.style.backgroundImage = 'url(' + evt.target.result + ')';
          img_url=evt.target.result;
        }
        reader.readAsDataURL(uploader.files[0]);
      }

      document.querySelector('.hide-button').onclick = function () {
        document.querySelector('.upload-result').style.display = 'none';
      };

      document.querySelector('.show-button').onclick = function () {
        document.querySelector('.upload-result').style.display = 'block';
      };
    })();

    $(document).on('mouseenter', '#send_button', function () {
      $(this).css('background','#D0D9DC').css('color','#4B515F');
  	}).on('mouseleave', '#send_button', function () {
      $(this).css('background','#799FB4').css('color','#F7F6E4');
  	});
    $(document).on('mouseenter', '#upload_img', function () {
      $(this).css('background','#D0D9DC').css('color','#4B515F');
    }).on('mouseleave', '#upload_img', function () {
      $(this).css('background','#799FB4').css('color','#F7F6E4');
    });
    $(document).on('mouseenter', '#switch_data', function () {
      $(this).css('opacity',1);
  	}).on('mouseleave', '#switch_data', function () {
      $(this).css('opacity',0.5);
  	});

    $(document).on('click',"#bar1",function(){
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.logout(function(response) {
                // this part just clears the $_SESSION var
                // replace with your own code
                console.log(response)
                location.href='./index.html'
            });
        }
        else{
            localStorage.clear();
            location.href='./index.html'
        }
    });
    

    
    $(document).on('click','#send_button',function(){
      console.log(localStorage.getItem("account"))

      if($("#name").val())
          user_name=$("#name").val().trim();
      if($("#mail").val())
        user_mail=$("#mail").val().trim();
      
      user_gender=$("#gender").val()==1? '男':'女';
      if($("#datepicker").val())
        user_birthday=$("#datepicker").val();
      console.log("sexial: "+user_gender);
      if(check()){
        $.post('./Users/changedata',{
          id:localStorage.getItem("account"),
          icon:img_url,
          name:user_name,
          mail:user_mail,
          gender:user_gender,
          birthday:user_birthday
        },(res)=>{
         console.log("post success!");
         buttonunable();
         hrefunable();

         $('.alert-mess').text('資料已更新')
         $('.check').css("visibility", "visible");
         $('.mask').css("visibility", "visible");
        });
      }
      
    })

    $('.checkconfirm').click(function(e) {
      buttonenable();
      hrefenable();
      $('.check').css("visibility", "hidden");
      $('.mask').css("visibility", "hidden");
    });

    let tri=0;
    $(document).on('click','#switch_data',function(){
      if(!tri){
        document.getElementById('user_text').textContent='我的足跡';
        $('#left_data').css('visibility','hidden');
        $('#upload_img').css('visibility','hidden');
        $('#img_post').css('visibility','hidden');
        $('.points').css('visibility','visible');
        $('#record').css('visibility','visible');
        $('#record_bar').css('visibility','visible');
        
        

        document.getElementById('switch_data').classList.remove('triangle');
        document.getElementById('switch_data').classList.add('anti-triangle');
        tri=1;
      }
      else{
        document.getElementById('user_text').textContent='我的檔案';
        $('#left_data').css('visibility','visible');
        $('#upload_img').css('visibility','visible');
        $('#img_post').css('visibility','visible');
        $('#record').css('visibility','hidden');
        $('.points').css('visibility','hidden');
        $('#record_bar').css('visibility','hidden');

        document.getElementById('switch_data').classList.remove('anti-triangle');
        document.getElementById('switch_data').classList.add('triangle');
        tri=0;
      }

    });
  });
function work_type(housework){
  if(housework.includes('洗碗')){
    return '../../img/housework/bowl.png';
  }
  else if (housework.includes('垃圾')){
    return '../../img/housework/garbage.png'       
  }
  else if (housework.includes('衣服')){
    return '../../img/housework/cloth.png'       
  }
  else if (housework.includes('掃地')){
    return '../../img/housework/sweep.png'       
  }
  else if (housework.includes('拖地')){
    return '../../img/housework/mop.png'       
  }
  else if (housework.includes('廁所')){
    return '../../img/housework/toilet.png'       
  }
  else{
    return '../../img/housework/share.png'
  }
}
function getUser() {
    var account = localStorage.getItem("account");
    $.get('./users/find/' + account, {}, (res) => {
        console.log(res)
        document.getElementById('name').placeholder=res.name;
        document.getElementById('img-result').style.backgroundImage = 'url('+res.icon+')';
        $('#user').css('background-image','url('+res.icon+')').css('background-size','cover');
        document.getElementById('mail').placeholder = res.mail;
        document.getElementById('gender').value = (res.gender=='未填'? 0:res.gender=='男'?1:2);
        document.getElementById('datepicker').placeholder = res.birthday;

        if(document.getElementById('gender').value != 0){
          document.getElementById('gender').options[0].classList.add('hide')
        }

        img_url=res.icon;
        user_name=res.name;
        user_gender=res.gender;
        user_mail=res.mail;
        user_birthday=res.birthday;

    });
    
    $.post('./Tasks/finished',{
      account:localStorage.getItem("account")
    },(res)=>{
      let coin_score=0;
      //console.log(res);
      for(let i=0;i<res.length;++i){
        //console.log(res[i].content+' '+res[i].date+' '+res[i].point);
        coin_score+=res[i].point;
        $('#record').append(`
        <div class="record_row container">
          <div class="img_containter item">
            <img src="${work_type(res[i].content)}">
          </div>
          <div class="record_text item">
            <div class="record_type">${res[i].content}</div>
            <div class="record_date">${res[i].date}</div>
          </div>
          <div class="record_points item">${res[i].point+'P'}</div>
          <div class="record_points item">${Math.round(res[i].point/10)+'P'}</div>
        </div>`
        )
      }
      document.getElementById('coin_score').textContent=coin_score+'P';
      document.getElementById('cookie_score').textContent=Math.round(coin_score/10)+'P';

    });
}

