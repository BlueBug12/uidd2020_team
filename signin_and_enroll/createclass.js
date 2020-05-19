$('#group_btn').click((event) => {
    event.preventDefault();
    $.post('./users/createclass', {
        account:localStorage.getItem("account"),
        classcode: $('#signin input[name=classcode]').val(),
        nickname: $('#signin input[name=nickname]').val()
    }, (res) => {
        console.log(success);
    });
});