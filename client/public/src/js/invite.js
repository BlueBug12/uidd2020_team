function getUser() {
    var account = localStorage.getItem("account");
     $.get('./users/find/' + account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
        localStorage.setItem("classcode", res.classcode);
    });
}