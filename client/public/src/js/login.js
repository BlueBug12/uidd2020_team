function error(type, str) {
    $(type + '-error').text(str);
    $(type).addClass('err');
}

function clear() {
    $('#account-error').text("");
    $('#password-error').text("");
    $('#account').removeClass('err');
    $('#password').removeClass('err');
}

function check() {
    clear();
	var english = /^[A-Za-z0-9]+$/;
    const account = $('#account').val().trim();
    const password = $('#password').val().trim();
    let ans = true;

    if (account == "") {
        error("#account", '未輸入帳號');
        ans = false;
    }else {
        if (!english.test(account)) {
            error("#account", '帳號只能包含英文和數字');
            ans = false;
        }
    }

    if (password == "") {
        error("#password", '未輸入密碼');
        ans = false;
    }
    return ans;

}
$('#login_btn').click((event) => {
    event.preventDefault()
    if (check() == true) {
        $.post('./users', {
            account: $('#signin input[name=account]').val().trim(),
            password: $('#signin input[name=password]').val().trim()
        }, (res) => {
            localStorage.account = res.account;
            if (res.text === "登入失敗！") {
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

$("#fb_btn").click(async function() {
    var account = "";
    var url = " ";
    var name = " ";
    await new Promise((resolve, reject) => {
        FB.getLoginStatus(async function(response) {
            if (response.authResponse) {
                await new Promise(resolve1 => {
                    FB.api('/me', { fields: 'id,name,email' }, function(response) {
                        localStorage.setItem("account", response.id);
                        account = response.id;
                        name = response.name
                    });
                    FB.api(
                        "/me/picture", {
                            "redirect": false,
                            "height": 50,
                            "width": 50,
                            "type": "normal"
                        },
                        function(response) {
                            if (response && !response.error) {
                                url = response.data.url;
                                resolve1();
                            }
                        }
                    );
                });
            } else {
                FB.login(async function(response) {
                    console.log(response);
                    if (response.authResponse) {
                        await new Promise(resolve => {
                            FB.api('/me', { fields: 'id,name,email' }, function(response) {
                                localStorage.setItem("account", response.id);
                                account = response.id;
                                name = response.name
                            });
                            FB.api(
                                "/me/picture", {
                                    "redirect": false,
                                    "height": 50,
                                    "width": 50,
                                    "type": "normal"
                                },
                                function(response) {
                                    if (response && !response.error) {
                                        url = response.data.url;
                                        resolve();
                                    }
                                }
                            );
                        });
                    }
                }, { scope: 'email' });
            }
            resolve();
        });
    });
    await $.post('./users/CheckData', {
        account: account,
        password: " ",
        name: name,
        phone: 0000000000,
        url: url
    }, (res) => {
        if (res.first === "true")
            location.href = './join.html';
        else
            location.href = './game.html';
    });
});