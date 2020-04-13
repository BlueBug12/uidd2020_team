$(document).ready(function() {

    $('#signin div[id=button]').click((event) => {
        event.preventDefault()
        $.post('./signin', {
            account: $('#signin input[name=account]').val(),
            password: $('#signin input[name=password]').val(),
        }, (res) => {
            console.log(res);
        });
    });

});