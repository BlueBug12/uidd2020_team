$(document).ready(function() {
  console.log("hello");


    let bannerbuttons = document.getElementsByClassName('bannerbutton');
    console.log(bannerbuttons);
    bannerbuttons[0].classList.add('active');


    for (let i = 0; i < bannerbuttons.length; i++) {
        bannerbuttons[i].addEventListener('click', function(e) {
            for (let i = 0; i < bannerbuttons.length; i++) {
                bannerbuttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }

});

function getUser() {
    var account = localStorage.getItem("account");
    $.get('./users/find/' + account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
        localStorage.setItem("classcode", res.classcode);
    });
}
