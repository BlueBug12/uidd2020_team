$('#login_btn').click((event) => {
    event.preventDefault()
    $.post('./users', {
        account: $('#signin input[name=account]').val(),
        password: $('#signin input[name=password]').val()
    }, (res) => {
        localStorage.account = res.account;
        if (res.text === "登入失敗！") {
          var modal = $('#myModal');
          modal.find('.modal-body p').text(res.text); 
          $('#myModal').modal('show'); 
        } else {
          
        }
    });
});

window.fbAsyncInit = function() {
    FB.init({
      appId      : myAppId,
      xfbml      : true,
      version    : 'v7.0'
    });
    FB.AppEvents.logPageView();
};
  // Load the SDK asynchronously
(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); 
     js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(function() {
  $("#fb_btn").click(async function() {
    var account = "";
    var url = " ";
    var name=" ";
    await new Promise((resolve, reject) => {
      FB.getLoginStatus(async function(response) {
        if (response.authResponse) {
          await new Promise(resolve => {
            FB.api('/me',{fields: 'id,name,email'}, function (response) {
              console.log(`Successful login for: ${response.name}`)
              console.log(response);
              localStorage.setItem("account", response.name);
              account=response.id;
              name = response.name;
              resolve();
            });
          });
          FB.api(
            "/me/picture",
            {
              "redirect": false,
              "height": 200,
              "width": 200,
              "type": "normal"
            },
            function (response) {
              if (response && !response.error) {
                url = response.data.url;
                console.log(response.data.url);
              }
            }
          );
        } else {
          FB.login(function (response) {
            if (response.authResponse) {
              FB.api('/me',{fields: 'id,name'}, function (response) {
              });
            }       
          }, { scope: 'email,user_likes' });
        }
        resolve();
      });
    });
    await $.post('./users/fbData', {
      account: account,
      name: name,
      url:url
    }, (res) => {
      console.log(res);
    });
    //location.href = './game.html';
  });
});