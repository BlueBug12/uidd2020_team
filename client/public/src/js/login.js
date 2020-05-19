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
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(function() {
    $("#fb_btn").click(function() {
        FB.getLoginStatus(function(response) {
            if (response.authResponse) {
                FB.api('/me', { fields: 'id,name,email' }, function(response) {
                    console.log(`Successful login for: ${response.name}`)
                    localStorage.setItem("account", response.name);
                    location.href = './game.html';
                });
            } else {
                //呼叫FB.login()請求使用者授權
                FB.login(function(response) {
                    if (response.authResponse) {
                        FB.api('/me', { fields: 'id,name,email' }, function(response) {});
                    }
                }, { scope: 'email,user_likes' });
            }
        });
    });
});