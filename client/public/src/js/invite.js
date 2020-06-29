$(document).ready(function() {
    var tasks = [];
    var vueinstance = new Vue({
        el: '#app',
        data: {
            shows: [],
            tasks: tasks,
        },
        methods: {
            remaintime: function(index) {
                var nowTime = new Date();
                var restSec = this.tasks[index].date.getTime() - nowTime.getTime();
                var day = parseInt(restSec / (60 * 60 * 24 * 1000));
                var hour = parseInt(restSec / (60 * 60 * 1000) % 24);
                var minu = parseInt(restSec / (60 * 1000) % 60);
                var sec = parseInt(restSec / 1000 % 60);
                var timestr = day + "天" + hour + "時" + minu + "分" + sec + "秒"
                if (restSec > 0) {
                    setTimeout(this.remaintime, 1000, index);
                    this.$set(this.tasks[index], 'remain', timestr);
                    this.$forceUpdate()
                } else {
                    $.post('./tasks/expired', {
                        id: this.tasks[index]._id
                    }, (res) => {
                        console.log(res);
                    });
                    this.$delete(this.tasks, index)
                    count = this.tasks.length;
                    //$('.solve-btn').attr('data-before', count);
                }
            },
            turnright: function(index) {
                console.log("123");
               if(index < this.tasks.length-1)
                    index = index + 1;
                console.log(index);
                for (var i = 0; i < this.shows.length; i++) {
                    this.$set(this.shows, i, false);
                }
                this.$set(this.shows, index, true);
            },
            turnleft: function(index) {
                console.log("456");
                if(index > 0)
                index = index - 1;
                for (var i = 0; i < this.shows.length; i++) {
                    this.$set(this.shows, i, false);
                }
                this.$set(this.shows, index, true);
            },
            refuse:function(index){
                $.post('./tasks/deny', {
                    id: this.tasks[index]._id,
                    account:localStorage.getItem("account")
                }, (res) => {
                    $('.alert-mess').text('任務已拒絕')
                });
                this.$delete(this.tasks, index);
                count = this.tasks.length;
                buttonunable();
                $('.check').css("visibility", "visible");
                $('.mask').css("visibility", "visible");
            },
            accept: function(index){
                $.post('./tasks/agree', {
                    id: this.tasks[index]._id,
                    account:localStorage.account,
                    participate: [{id:localStorage.account,state:1,icon:$('#UserImg').src}]
                }, (res) => {
                    $('.alert-mess').text('任務已接受')
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
                            this.remaintime(i);
                        }
                        this.shows[0] = true;
                        this.remaintime(0);
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
        resultdate = []
        rec_task.forEach((item) => {
            var date = item.date.split('/');
            var year = date[2];
            var day = date[1];
            var month = date[0];
            var time = item.time.split(' ');
            var hour = parseInt(time[0].split(':'));
            var hour = (time[1][0] == 'P') ? hour + 12 : hour;
            var missiondate = new Date(year, month - 1, day, hour, 00, 00);
            resultdate.push(missiondate)
        })
        for (var i = 0; i < rec_task.length; i++) {
            rec_task[i].date = resultdate[i];
            rec_task[i]["remain"] = 0;
        }
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
        $.post('./tasks/invite', {
            account: localStorage.account,
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

