$('#enroll_btn').click((event) => {
    event.preventDefault()
    $.post('./users/enroll', {
        account: $('#signin input[name=account]').val(),
        password: $('#signin input[name=password]').val(),
        name: $('#signin input[name=name]').val(),
        phone: $('#signin input[name=phone]').val()
    }, (res) => {
        localStorage.account = res.account;
    });
});