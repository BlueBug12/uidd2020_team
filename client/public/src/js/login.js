$('#login_btn').click((event) => {
    event.preventDefault()
    let form = document.getElementsByTagName('form');
    if (form[0].checkValidity() === false) {
        form[0].classList.add('was-validated');
    } else {
        $.post('./users', {
            account: $('#signin input[name=account]').val(),
            password: $('#signin input[name=password]').val()
        }, (res) => {
            localStorage.account = res.account;
            if (res.text === "登入失敗") {
                var modal = $('#myModal');
                modal.find('.modal-body p').text(res.text);
                $('#myModal').modal('show');
            } else {
                location.href = './game.html';
            }
        });
    }
});

window.fbAsyncInit = function() {
    FB.init({
        appId: myAppId,
        xfbml: true,
        version: 'v7.0'
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
              localStorage.setItem("account", response.id);
              account=response.id;
              name = response.name
            });
            FB.api(
              "/me/picture",
              {
              "redirect": false,
              "height": 50,
              "width": 50,
              "type": "normal"
              },
              function (response) {
              if (response && !response.error) {
                  url = response.data.url;
                  resolve();
              }
              }
            );
          });
        } else {
          FB.login(async function(response) {
            if (response.authResponse) {
              await new Promise(resolve => {
                FB.api('/me',{fields: 'id,name,email'}, function (response) {
                  localStorage.setItem("account", response.id);
                  account=response.id;
                  name = response.name
                });
                FB.api(
                  "/me/picture",
                  {
                  "redirect": false,
                  "height": 50,
                  "width": 50,
                  "type": "normal"
                  },
                  function (response) {
                  if (response && !response.error) {
                      url = response.data.url;
                      resolve();
                  }
                  }
                );
              });
            }       
          }, { scope: 'email,user_likes' });
        }
        resolve();
      });
    });
    await $.post('./users/CheckData', {
      account: account,
      password: " ",
      name: name,
      phone: 0000000000,
      url:url
    }, (res) => {
      if(res.first==="true")
        location.href = './join.html';
      else
        location.href = './game.html';
    });
    
  });
});
