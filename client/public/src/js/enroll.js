function error(type, str) {
    $(type + '-error').text(str);
    $(type).addClass('err');
}

function clear() {
    $('#name-error').text("");
    $('#account-error').text("");
    $('#password-error').text("");
    $('#password2-error').text("");
    $('#phone-error').text("");
    $('#name').removeClass('err');
    $('#account').removeClass('err');
    $('#password').removeClass('err');
    $('#password2').removeClass('err');
    $('#phone').removeClass('err');

}

function check() {
    clear();
    var english = /^[A-Za-z0-9]+$/;
    var phonenumber = /^09[0-9]{8}$/
    const name = $('#name').val().trim();
    const account = $('#account').val().trim();
    const password = $('#password').val().trim();
    const password2 = $('#password2').val().trim();
    const phone = $('#phone').val().trim();
    let ans = true;

    if (name == "") {
        error("#name", '此為必填欄位');
        ans = false;
    }

    if (account == "") {
        error("#account", '此為必填欄位');
        ans = false;
    } else {
        if (!english.test(account)) {
            error("#account", '帳號只能包含英文和數字');
            ans = false;
        }
    }
    if (password == "") {
        error("#password", '此為必填欄位');
        ans = false;
    } else {
        if (password.length < 6) {
            error("#password", '密碼需大於六個字元');
            ans = false;
        } else if (password.length > 10) {
            error("#password", '密碼需小於十個字元');
            ans = false;
        }
    }
    if (password2 == "") {
        error("#password2", '此為必填欄位');
        ans = false;
    } else {
        if (password != password2) {
            error("#password2", '密碼與上方不符');
            ans = false;
        }
    }


    if (phone == "") {
        error("#phone", '此為必填欄位');
        ans = false;
    } else {
        if (phone.length != 10 || !phonenumber.test(phone)) {
            error("#phone", '手機號碼格式錯誤');
            ans = false;
        }
    }
    return ans;

}

$('#enroll_btn').click((event) => {
    event.preventDefault();
    if (check() == true) {
        $.post('./users/enroll', {
            account: $('#signin input[name=account]').val().trim(),
            password: $('#signin input[name=password]').val().trim(),
            name: $('#signin input[name=name]').val().trim(),
            phone: $('#signin input[name=phone]').val().trim()
        }, (res) => {
            console.log(res);
            localStorage.setItem("account", res.account);
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
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(function() {
    $("#fb_btn").click(async function() {
        var account = "";
        var url = " ";
        var name = " ";
        await new Promise(resolve => {
            FB.getLoginStatus(async function(response) {
                if (response.authResponse) {
                    await new Promise(resolve => {
                        FB.api('/me', { fields: 'id,name,email' }, function(response) {
                            console.log(`Successful login for: ${response.name}`)
                            localStorage.setItem("account", response.name);
                            account = response.id;
                            name = response.name;
                            resolve();
                        });
                        FB.api(
                            "/me/picture", {
                                "redirect": false,
                                "height": 200,
                                "width": 200,
                                "type": "normal"
                            },
                            function(response) {
                                if (response && !response.error) {
                                    url = response.data.url;
                                }
                            }
                        );
                    });
                } else {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            FB.api('/me', { fields: 'id,name' }, function(response) {});
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
            url: url
        }, (res) => {
            console.log(res);
        });
        //location.href = './join.html';
    });
});