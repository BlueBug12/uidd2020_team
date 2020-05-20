$('#enroll_btn').click((event) => {
    event.preventDefault();
    let form = document.getElementsByTagName('form');
    if (form[0].checkValidity() === false) {
        form[0].classList.add('was-validated');
    } else {
        $.post('./users/enroll', {
            account: $('#signin input[name=account]').val(),
            password: $('#signin input[name=password]').val(),
            name: $('#signin input[name=name]').val(),
            phone: $('#signin input[name=phone]').val()
        }, (res) => {
            localStorage.account = res.account;
        });
        location.href = './join.html';
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
    await new Promise(resolve => {
      FB.getLoginStatus(async function(response) {
        if (response.authResponse) {
          await new Promise(resolve => {
            FB.api('/me',{fields: 'id,name,email'}, function (response) {
              console.log(`Successful login for: ${response.name}`)
              localStorage.setItem("account", response.name);
              account=response.id;
              name = response.name;
              resolve();
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
                }
                }
            );
        });
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
    await $.post('./users/FbEnroll', {
      account: account,
      password: " ",
      name: name,
      phone: 0000000000,
      url:url
    }, (res) => {
      console.log(res);
    });
    //location.href = './join.html';
  });
});