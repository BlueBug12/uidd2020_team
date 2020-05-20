$('#group_btn').click((event) => {
    event.preventDefault();
    let form = document.getElementsByTagName('form');
    if (form[0].checkValidity() === false) {
        form[0].classList.add('was-validated');
    } else {
        postData(event);
    }
});

$('#group_btn2').click((event) => {
    event.preventDefault();
    let form = document.getElementsByTagName('form');
    if (form[0].checkValidity() === false) {
        form[0].classList.add('was-validated');
    } else {
        postData(event);
    }
});

function postData(event) {
    $.post('./users/createclass', {
        account: localStorage.getItem("account"),
        classcode: $('#signin input[name=classcode]').val(),
        nickname: $('#signin input[name=nickname]').val()
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
    await $.get('./users/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    }); 
}