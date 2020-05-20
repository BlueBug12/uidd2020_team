function error(type, str) {
    $(type + '-error').text(str);
    $(type).addClass('err');
}

function clear() {
    $('#classcode-error').text("");
    $('#nickname-error').text("");
    $('#classcode').removeClass('err');
    $('#nickname').removeClass('err');

}

function check() {
    clear();
    const classcode = $('#classcode').val().trim();
    const nickname = $('#nickname').val().trim();
    let ans = true;

    if (classcode == "") {
        error("#classcode", '此為必填欄位');
        ans = false;
    }

    if (nickname == "") {
        error("#nickname", '此為必填欄位');
        ans = false;
    }

    return ans;

}


$('#group_btn').click((event) => {
    event.preventDefault();
    if (check() == true) {
        postData(event);
    }
});

$('#group_btn2').click((event) => {
    event.preventDefault();
    if (check() == true) {
        postData(event);
    }
});

function postData(event) {
    $.post('./users/createclass', {
        account: localStorage.getItem("account"),
        classcode: $('#signin input[name=classcode]').val().trim(),
        nickname: $('#signin input[name=nickname]').val().trim()
    }, (res) => {
        if (event.target.id.endsWith('2')) {
            location.href = './floorplan.html';
        } else {
            location.href = './game.html';
        }
    });
}
async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/' + account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    });
}