$(document).ready(function() {
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
    var tasks = [];
    var vueinstance = new Vue({
        el: '#app',
        data: {
            shows: [],
            tasks: tasks,
            change1: 0,
            change2: 0,
            back:0,
            hides:[],
        },
        methods: {
            refuse:function(index){
                console.log($('#UserImg').attr('src'))
                $.post('./tasks/verifystate', {
                    id: this.tasks[index]._id,
                    verify: [{id:localStorage.account,state:0,icon:$('#UserImg').css('background-image').replace(/(url\(|\)|")/g, '')}]
                }, (res) => {
                    $('.alert-mess').text('任務已審核')
                });
                $.post('./tasks/checkstate', {
                    classcode: localStorage.classcode,
                }, (res) => {
                    console.log(res);
                });
                this.$delete(this.tasks, index);
                count = this.tasks.length;
                buttonunable();
                $('.check').css("visibility", "visible");
                $('.mask').css("visibility", "visible");
            },
            accept: function(index){
                $.post('./tasks/verifystate', {
                    id: this.tasks[index]._id,
                    verify: [{id:localStorage.account,state:1,icon:$('#UserImg').css('background-image').replace(/(url\(|\)|")/g, '')}]
                }, (res) => {
                    $('.alert-mess').text('任務已審核')
                });
                $.post('./tasks/checkstate', {
                    classcode: localStorage.classcode,
                }, (res) => {
                    console.log(res);
                });
                this.$delete(this.tasks, index);
                count = this.tasks.length;
                buttonunable();
                $('.check').css("visibility", "visible");
                $('.mask').css("visibility", "visible");
            },
        },
        watch: {
            tasks: {
                handler() {
                    if (this.tasks.length != 0) {
                        this.shows = [];
                        for (var i = 0; i < this.tasks.length; i++) {
                            this.shows.push(false);
                        }
                        this.shows[0] = true;
                        if(this.tasks.length > 5){
                            this.hides = [];
                            for (var i = 0; i <= 4; i++) {
                                this.hides.push(false);
                            }
                            for (var i = 5; i < this.tasks.length; i++) {
                                this.hides.push(true);
                            }
                        }
                        $('#noitem').removeClass("active");
                    }
                    else{
                        this.shows = [];
                        $('#noitem').addClass("active");
                    }
                },
            }
        }
    });
    $(document).mousemove(function(e){
        console.log(e.pageX + ", " + e.pageY);
        if(e.pageX < 920){
            this.change1 = 1;
            document.getElementsByClassName("info")[0].classList.add("move1");
            document.getElementsByClassName("right")[0].classList.add("animate");
            document.getElementsByClassName("deny")[0].classList.remove("animate");
            if(this.change2 == 1){
                document.getElementsByClassName("info")[0].classList.remove("move2");
                this.change2 = 0;
            }
        }else{
            this.change2 = 1;
            document.getElementsByClassName("right")[0].classList.remove("animate");
            document.getElementsByClassName("info")[0].classList.add("move2");
            document.getElementsByClassName("deny")[0].classList.add("animate");
            if(this.change1 == 1){
                document.getElementsByClassName("info")[0].classList.remove("move1");
                this.change1 = 0;
            }
        }
      });
      $(document).mouseout(function(e){
            this.change1 = 0;
            this.change2 = 0;
            document.getElementsByClassName("right")[0].classList.remove("animate");
            document.getElementsByClassName("deny")[0].classList.remove("animate");
            if(this.change1 == 1 ){
                document.getElementsByClassName("info")[0].classList.add("origin");
            }
            document.getElementsByClassName("info")[0].classList.remove("move1");
            document.getElementsByClassName("info")[0].classList.remove("move2");
      });
    function setTask(res){
        rec_task=[];
        rec_task=res;
        rec_task.forEach((item) => {
            var region_content = item.region_content.split(':');
            var floor = region_content[0];
            var region = region_content[1];
            var temp = floor + " " + region;
            item.region = temp;
        })
        count = rec_task.length;
        if(count == 0)
            $('#noitem').addClass("active");
        vueinstance.tasks = rec_task;
    }
    $('.checkconfirm').click(function(e) {
        buttonenable();
        $('.check').css("visibility", "hidden");
        $('.mask').css("visibility", "hidden");
    });
    function buttonenable() {
        let buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
            buttons[i].style.cursor = "pointer";
        }
    }
    function buttonunable() {
        let buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            buttons[i].style.cursor = "default";
        }
        $('.checkconfirm').css("cursor", "pointer");
        $('.checkconfirm').prop("disabled", false);
    }
    window.onload = function() {
        $.post('./tasks/verify', {
            account:localStorage.getItem("account")
        }, (res) => {
            setTask(res);
        });
        var account = localStorage.getItem("account");
        $.get('./users/find/' + account, {}, (res) => {
            document.getElementById("UserImg").style.backgroundImage= `url(${res.icon})`;
            localStorage.setItem("classcode", res.classcode);
        });
        
    };
    $('#process-btn').click(function(e){
        location.href = './process.html';
    })
    $('#request-btn').click(function(e){
        location.href = './invite.html';
    })
    $('#verify-btn').click(function(e){
        location.href = './verify.html';
    })
    $('#point-btn').click(function(e){
        location.href = './point.html';
    })
    $(document).on('click',"#bar2",function(){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                FB.logout(function(response) {
                    // this part just clears the $_SESSION var
                    // replace with your own code
                    console.log(response)
                    location.href='./index.html'
                });
            }
            else{
                localStorage.clear();
                location.href='./index.html'
            }
        });
    })
});

