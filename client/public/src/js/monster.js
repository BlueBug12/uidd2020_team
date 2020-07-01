var rh=1;
var lh=1;
var rl=1;
var ll=1;
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

$(document).on('click',"#left_hand_button",function(){
    
    let v = lh%10
    if(lh!=20)
        $("#left_hand_value").css('width',`${42+25*v}px`);
    else
        $("#left_hand_value").css('width',`284px`);
    if(v==1){
        $('#left_hand').css('right','376px').css('top',"312px").css('width','46px').css('height','46px');
    }else if(v==2){
        $('#left_hand').css('right','371px').css('top',"311px").css('width','52px').css('height','52px');
    }else if(v==3){
        $('#left_hand').css('right','367px').css('top',"309px").css('width','58px').css('height','58px');
    }else if(v==4){
        $('#left_hand').css('right','363px').css('top',"308px").css('width','64px').css('height','64px');
    }else if(v==5){
        $('#left_hand').css('right','358px').css('top',"307px").css('width','70px').css('height','70px');
    }else if(v==6){
        $('#left_hand').css('right','354px').css('top',"306px").css('width','76px').css('height','76px');
    }else if(v==7){
        $('#left_hand').css('right','350px').css('top',"304px").css('width','82px').css('height','82px');
    }else if(v==8){
        $('#left_hand').css('right','346px').css('top',"303px").css('width','88px').css('height','88px');;
    }else if(v==9){
        $('#left_hand').css('right','342px').css('top',"302px").css('width','94px').css('height','94px');
    }else{
        if(lh<=19){
            lh+=1;
            document.getElementById('lh').src='./img/monster/lefthand2.svg';
            $('#left_hand').css('width','40px').css('height','40px');
            document.getElementById("lh_level").innerHTML="Lv.2";
        }
        else{
            lh-=1
        }
        
    }
    lh+=1;
    
})
$(document).on('click',"#right_hand_button",function(){
    let v = rh%10;
    if(rh!=20)
        $("#right_hand_value").css('width',`${42+25*v}px`);
    else
        $("#right_hand_value").css('width',`284px`);
    if(v==1){
        $('#right_hand').css('right','541px').css('top',"312px").css('width','46px').css('height','46px');
    }else if(v==2){
        $('#right_hand').css('right','537px').css('top',"312px").css('width','52px').css('height','52px');
    }else if(v==3){
        $('#right_hand').css('right','536px').css('top',"311px").css('width','58px').css('height','58px');
    }else if(v==4){
        $('#right_hand').css('right','532px').css('top',"310px").css('width','64px').css('height','64px');
    }else if(v==5){
        $('#right_hand').css('right','530px').css('top',"310px").css('width','70px').css('height','70px');
    }else if(v==6){
        $('#right_hand').css('right','527px').css('top',"308px").css('width','76px').css('height','76px');
    }else if(v==7){
        $('#right_hand').css('right','524px').css('top',"308px").css('width','82px').css('height','82px');
    }else if(v==8){
        $('#right_hand').css('right','521px').css('top',"308px").css('width','88px').css('height','88px');;
    }else if(v==9){
        $('#right_hand').css('right','518px').css('top',"306px").css('width','94px').css('height','94px');
    }else{
        if(rh<=19){
            rh+=1;
            document.getElementById('rh').src='./img/monster/righthand2.svg';
            $('#right_hand').css('width','40px').css('height','40px');
            document.getElementById("rh_level").innerHTML="Lv.2";
        }
        else{
            rh-=1;
        }
    }
    rh+=1;
})
$(document).on('click',"#left_leg_button",function(){
    let v = ll%10;
    if(ll!=20)
        $("#left_leg_value").css('width',`${42+25*v}px`);
    else
    $("#left_leg_value").css('width',`284px`);
    if(v==1){
        $('#left_leg').css('right','406px').css('top',"427px").css('width','46px').css('height','46px');
    }else if(v==2){
        $('#left_leg').css('right','403px').css('top',"427px").css('width','52px').css('height','52px');
    }else if(v==3){
        $('#left_leg').css('right','400px').css('top',"427px").css('width','58px').css('height','58px');
    }else if(v==4){
        $('#left_leg').css('right','397px').css('top',"427px").css('width','64px').css('height','64px');
    }else if(v==5){
        $('#left_leg').css('right','392px').css('top',"426px").css('width','70px').css('height','70px');
    }else if(v==6){
        $('#left_leg').css('right','388px').css('top',"425px").css('width','76px').css('height','76px');
    }else if(v==7){
        $('#left_leg').css('right','386px').css('top',"424px").css('width','82px').css('height','82px');
    }else if(v==8){
        $('#left_leg').css('right','382px').css('top',"422px").css('width','88px').css('height','88px');;
    }else if(v==9){
        $('#left_leg').css('right','380px').css('top',"424px").css('width','94px').css('height','94px');
    }else{
        if(ll<=19){
            ll+=1;
            document.getElementById('ll').src='./img/monster/leftleg2.svg';
            $('#left_leg').css('width','40px').css('height','40px');
            document.getElementById("ll_level").innerHTML="Lv.2";
        }
        else{
            ll-=1;
        }
        
    }
    ll+=1;
})
$(document).on('click',"#right_leg_button",function(){
    let v = rl%10;
    if(rl!=20)
        $("#right_leg_value").css('width',`${42+25*v}px`);
    else
        $("#right_leg_value").css('width',`284px`);
    if(v==1){
        $('#right_leg').css('right','524px').css('top',"426px").css('width','46px').css('height','46px');
    }else if(v==2){
        $('#right_leg').css('right','523px').css('top',"425px").css('width','52px').css('height','52px');
    }else if(v==3){
        $('#right_leg').css('right','522px').css('top',"425px").css('width','58px').css('height','58px');
    }else if(v==4){
        $('#right_leg').css('right','519px').css('top',"425px").css('width','64px').css('height','64px');
    }else if(v==5){
        $('#right_leg').css('right','517px').css('top',"425px").css('width','70px').css('height','70px');
    }else if(v==6){
        $('#right_leg').css('right','515px').css('top',"424px").css('width','76px').css('height','76px');
    }else if(v==7){
        $('#right_leg').css('right','514px').css('top',"421px").css('width','82px').css('height','82px');
    }else if(v==8){
        $('#right_leg').css('right','510px').css('top',"422px").css('width','88px').css('height','88px');;
    }else if(v==9){
        $('#right_leg').css('right','506px').css('top',"423px").css('width','94px').css('height','94px');
    }else{
        if(rl<=19){
            rl+=1;
            document.getElementById('rl').src='./img/monster/rightleg2.svg';
            $('#right_leg').css('width','40px').css('height','40px');
            document.getElementById("rl_level").innerHTML="Lv.2";
        }
        else{
            rl-=1;
        }
       
    }
    rl+=1;
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