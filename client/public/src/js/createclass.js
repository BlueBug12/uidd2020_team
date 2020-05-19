$('#group_btn').click((event) => {
    event.preventDefault();
    postData(event);
});

$('#group_btn2').click((event) => {
    event.preventDefault();
    postData(event);
});

function postData(event) {
    console.log('aaaaa')
    $.post('./users/createclass', {
        account:localStorage.getItem("account"),
        classcode: $('#signin input[name=classcode]').val(),
        nickname: $('#signin input[name=nickname]').val()
    }, (res) => {
        console.log(event.target.id.endsWith('2'))
        if (event.target.id.endsWith('2')) {
            location.href = './floorplan.html';
        } else {
            location.href = './game.html';
        }
    });
}
