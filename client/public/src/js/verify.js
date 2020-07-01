$(document).ready(function() {
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
                $.post('./tasks/verifystate', {
                    id: this.tasks[index]._id,
                    verify: [{id:localStorage.account,state:0,icon:$('#UserImg').src}]
                }, (res) => {
                    $('.alert-mess').text('任務已審核')
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
                    verify: [{id:localStorage.account,state:1,icon:$('#UserImg').src}]
                }, (res) => {
                    $('.alert-mess').text('任務已審核')
                });
                this.$delete(this.tasks, index);
                count = this.tasks.length;
                buttonunable();
                $('.check').css("visibility", "visible");
                $('.mask').css("visibility", "visible");
            },
            getPos: function(index){
                if(index == 0){
                    x=event.clientX;
                    y=event.clientY;
                    if(x < 870){
                        this.change1 = 1;
                        document.getElementsByClassName("info")[0].classList.add("move1");
                        if(this.change2 == 1){
                            document.getElementsByClassName("info")[0].classList.remove("move2");
                            this.change2 = 0;
                        }
                    }
                    else{
                        this.change2 = 1;
                        document.getElementsByClassName("info")[0].classList.add("move2");
                        if(this.change1 == 1){
                            document.getElementsByClassName("info")[0].classList.remove("move1");
                            this.change1 = 0;
                        }
                    }
                }
                
            },
            stopTracking: function(index){
                if(index == 0){
                    this.change1 = 0;
                    this.change2 = 0;
                    if(this.change1 == 1 || this.change2 == 1){
                        document.getElementsByClassName("info")[0].classList.add("origin");
                    }
                    document.getElementsByClassName("info")[0].classList.remove("move1");
                    document.getElementsByClassName("info")[0].classList.remove("move2");
                }
            }

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
                            for (var i = 0; i < 4; i++) {
                                this.hides.push(false);
                            }
                            for (var i = 4; i < this.tasks.length; i++) {
                                this.hides.push(true);
                            }
                        }
                    }
                    else{
                        this.shows = [];
                    }
                },
            }
        }
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
            console.log(res);
            setTask(res);
        });
        var account = localStorage.getItem("account");
        $.get('./users/find/' + account, {}, (res) => {
            document.getElementById("UserImg").src = res.icon;
            localStorage.setItem("classcode", res.classcode);
        });
        
    };
});

