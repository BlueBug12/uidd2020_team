//const { set } = require("mongoose");

var rh=0;
var lh=0;
var rl=0;
var ll=0;
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
function store(){
    $.post('./users/updatemonsterstate', {
        account: localStorage.account,
        monster:[lh,rh,ll,rl]
    }, (res) => {
    });
}
function set_lh(v){
    if(v!=20)
        $("#left_hand_value").css('width',`${42+25*(v%10)}px`);
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
    }else if(v==10){
        $('#left_hand').css('right','373px').css('top',"282px").css('width','40px').css('height','40px');
        document.getElementById('lh').src='./img/monster/lefthand2.svg';
        document.getElementById("lh_level").innerHTML="Lv.2";
    }else if(v==11){
        $('#left_hand').css('right','368px').css('top',"277px").css('width','46px').css('height','46px');
    }else if(v==12){
        $('#left_hand').css('right','362px').css('top',"272px").css('width','52px').css('height','52px');
    }else if(v==13){
        $('#left_hand').css('right','356px').css('top',"266px").css('width','58px').css('height','58px');
    }else if(v==14){
        $('#left_hand').css('right','350px').css('top',"261px").css('width','64px').css('height','64px');
    }else if(v==15){
        $('#left_hand').css('right','344px').css('top',"255px").css('width','70px').css('height','70px');
    }else if(v==16){
        $('#left_hand').css('right','338px').css('top',"250px").css('width','76px').css('height','76px');
    }else if(v==17){
        $('#left_hand').css('right','332px').css('top',"244px").css('width','82px').css('height','82px');
    }else if(v==18){
        $('#left_hand').css('right','326px').css('top',"238px").css('width','88px').css('height','88px');
    }else if(v==19){
        $('#left_hand').css('right','320px').css('top',"230px").css('width','94px').css('height','94px');
    }else{
        $('#left_hand').css('right','316px').css('top',"225px").css('width','100px').css('height','100px');
    }   
    
}

  /* 
$(document).on('click',"#right_hand_button",function(){
    let v = rh%10;
    if(rh!=20)
        $("#right_hand_value").css('width',`${42+25*v}px`);
})*/
function set_rh(v){
    if(v!=20)
        $("#right_hand_value").css('width',`${42+25*(v%10)}px`);
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
    }else if(v==10){
        $('#right_hand').css('right','558px').css('top',"289px").css('width','40px').css('height','40px');
        document.getElementById('rh').src='./img/monster/righthand2.svg';
        document.getElementById("rh_level").innerHTML="Lv.2";
    }else if(v==11){
        $('#right_hand').css('right','558px').css('top',"284px").css('width','46px').css('height','46px');
    }else if(v==12){
        $('#right_hand').css('right','558px').css('top',"278px").css('width','52px').css('height','52px');
    }else if(v==13){
        $('#right_hand').css('right','558px').css('top',"274px").css('width','58px').css('height','58px');
    }else if(v==14){
        $('#right_hand').css('right','552px').css('top',"271px").css('width','64px').css('height','64px');
    }else if(v==15){
        $('#right_hand').css('right','552px').css('top',"268px").css('width','70px').css('height','70px');
    }else if(v==16){
        $('#right_hand').css('right','552px').css('top',"260px").css('width','76px').css('height','76px');
    }else if(v==17){
        $('#right_hand').css('right','552px').css('top',"255px").css('width','82px').css('height','82px');
    }else if(v==18){
        $('#right_hand').css('right','550px').css('top',"250px").css('width','88px').css('height','88px');
    }else if(v==19){
        $('#right_hand').css('right','549px').css('top',"244px").css('width','94px').css('height','94px');
    }else{
        $('#right_hand').css('right','546px').css('top',"242px").css('width','100px').css('height','100px');
    }
    
}

function set_ll(v){
    if(ll!=20)
        $("#left_leg_value").css('width',`${42+25*(v%10)}px`);
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
    }else if(v==10){
        $('#left_leg').css('right','400px').css('top',"430px").css('width','40px').css('height','40px');
        document.getElementById('ll').src='./img/monster/leftleg2.svg';
        document.getElementById("ll_level").innerHTML="Lv.2";
    }else if(v==11){
        $('#left_leg').css('right','396px').css('top',"428px").css('width','46px').css('height','46px');
    }else if(v==12){
        $('#left_leg').css('right','390px').css('top',"428px").css('width','52px').css('height','52px');
    }else if(v==13){
        $('#left_leg').css('right','386px').css('top',"428px").css('width','58px').css('height','58px');
    }else if(v==14){
        $('#left_leg').css('right','380px').css('top',"426px").css('width','64px').css('height','64px');
    }else if(v==15){
        $('#left_leg').css('right','375px').css('top',"426px").css('width','70px').css('height','70px');
    }else if(v==16){
        $('#left_leg').css('right','370px').css('top',"426px").css('width','76px').css('height','76px');
    }else if(v==17){
        $('#left_leg').css('right','364px').css('top',"424px").css('width','82px').css('height','82px');
    }else if(v==18){
        $('#left_leg').css('right','360px').css('top',"426px").css('width','88px').css('height','88px');
    }else if(v==19){
        $('#left_leg').css('right','355px').css('top',"426px").css('width','94px').css('height','94px');
    }else{
        $('#left_leg').css('right','350px').css('top',"426px").css('width','100px').css('height','100px');
    }
    
}
function set_rl(v){
    if(rl!=20)
        $("#right_leg_value").css('width',`${42+25*(v%10)}px`);
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
    }else if(v==10){
        $('#right_leg').css('right','528px').css('top',"425px").css('width','40px').css('height','40px');
        document.getElementById('rl').src='./img/monster/rightleg2.svg';
        document.getElementById("rl_level").innerHTML="Lv.2";
    }else if(v==11){
        $('#right_leg').css('right','528px').css('top',"425px").css('width','46px').css('height','46px');
    }else if(v==12){
        $('#right_leg').css('right','524px').css('top',"425px").css('width','52px').css('height','52px');
    }else if(v==13){
        $('#right_leg').css('right','524px').css('top',"425px").css('width','58px').css('height','58px');
    }else if(v==14){
        $('#right_leg').css('right','522px').css('top',"425px").css('width','64px').css('height','64px');
    }else if(v==15){
        $('#right_leg').css('right','522px').css('top',"425px").css('width','70px').css('height','70px');
    }else if(v==16){
        $('#right_leg').css('right','518px').css('top',"425px").css('width','76px').css('height','76px');
    }else if(v==17){
        $('#right_leg').css('right','514px').css('top',"425px").css('width','82px').css('height','82px');
    }else if(v==18){
        $('#right_leg').css('right','512px').css('top',"425px").css('width','88px').css('height','88px');
    }else if(v==19){
        $('#right_leg').css('right','510px').css('top',"425px").css('width','94px').css('height','94px');
    }else{
        $('#right_leg').css('right','508px').css('top',"423px").css('width','100px').css('height','100px');
    }
}
$(document).on('click',"#left_hand_button",function(){
    if(lh<20){
        lh+=1;
        set_lh(lh);
        document.getElementById("points").innerHTML="test";
        store();
    }
    
})
$(document).on('click',"#right_hand_button",function(){
    if(rh<20){
        rh+=1;
        set_rh(rh);
        store();
    }
})
$(document).on('click',"#left_leg_button",function(){
    if(ll<20){
        ll+=1;
        set_ll(ll);
        store();
    }
})
$(document).on('click',"#right_leg_button",function(){
    if(rl<20){
        rl+=1;
        set_rl(rl);
        store();
    }
})


    function getUser() {
        var account = localStorage.getItem("account");
        $.get('./users/find/' + account, {}, (res) => {
            //document.getElementById("UserImg").src = res.icon;
            document.getElementById("UserImg").style.backgroundImage= `url(${res.icon})`;
            var cookie = res.point / 10;
            document.getElementById("current-point").innerText = `${cookie}P`;
            localStorage.setItem("classcode", res.classcode);
            setMonster(res);
        });
    }
    function setMonster(res) {
        lh = res.monster[0];
        rh = res.monster[1];
        ll = res.monster[2];
        rl = res.monster[3];    
    }