$(document).ready(function() {
    var tasks = [];
    var vueinstance = new Vue({
        el: '#app',
        data: {
            shows: [],
            tasks: tasks,
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

