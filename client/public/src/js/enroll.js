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