$(document).ready(function() {
    var tasks = [];
    var members = [];
    var vueinstance = new Vue({
        el: '#app',
        data: {
            tasks:tasks,
            members:members,
            shows: [],
            countdown:[],
        },
        methods: {
            showPanel: function(panelIndex) {
                for (var i = 0; i < this.shows.length; i++) {
                    this.$set(this.shows, i, false);
                }
                this.$set(this.shows, panelIndex, true);
            },
            memberchoose: function(index) {
                if (members[index].on == false)
                    this.$set(members[index], 'on', true)
                else
                    this.$set(members[index], 'on', false)
            },
            remaintime: function(index) {
                    var nowTime = new Date();
                    var restSec = this.tasks[index].date.getTime() - nowTime.getTime();
                    var day = parseInt(restSec / (60 * 60 * 24 * 1000));
                    var hour = parseInt(restSec / (60 * 60 * 1000) % 24);
                    var minu = parseInt(restSec / (60 * 1000) % 60);
                    var sec = parseInt(restSec / 1000 % 60);
                    var timestr = day + "天" + hour + "時" + minu + "分" + sec + "秒"
                    if (restSec > 0){
                        setTimeout(this.remaintime, 1000, index);
                        this.$set(this.tasks[index], 'remain', timestr);
                        this.$forceUpdate()
                    }
                    else {
                        count = temp.length;
                        $('.solve-btn').attr('data-before', count);
                        clearTimeout
                        this.$delete(this.tasks,index)
                    }
            },

            missiontoggle:function(index, num) {
                if (num == 0) {
                   // tasks[index].missionstate = true;
                    this.$set(tasks[index],'missionstate',true);
                } else {
                   // tasks[index].missionstate = false;
                    this.$set(tasks[index],'missionstate',false);
                }
            },

            turnright:function(index){
                var temp = members.pop();
                members.unshift(temp);
            },
            turnleft:function(index){
                var temp = members.shift();
                members.push(temp);
            }
        },

        watch: {
            tasks: {
                handler () {
                    if (this.tasks.length != 0) {
                        this.shows = [];
                        this.countdown=[]
                        for (var i = 0; i < this.tasks.length; i++) {
                            this.shows.push(false);
                            this.countdown.push(true);
                            this.remaintime(i);
                        }
                        this.shows[0] = true;
                        this.countdown[0] = true;
                        this.remaintime(0);
                    }
                },
            }
        }
    })


    let bannerbuttons = document.getElementsByClassName('bannerbutton');
    bannerbuttons[0].classList.add('active');


    for (let i = 0; i < bannerbuttons.length; i++) {
        bannerbuttons[i].addEventListener('click', function(e) {
            for (let i = 0; i < bannerbuttons.length; i++) {
                bannerbuttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }



    $('.request-btn').css("opacity", "1");
    $('.solve-btn').click(function() {
        $(this).addClass('active');
        $('.request-btn').removeClass('active');
        $(this).css("opacity", "1");
        $('.request-btn').css("opacity", "0.5");
        $('.request-mission').css("display", "none");
        $('.solve-mission').css("display", "block");
    })

    $('.request-btn').click(function() {
        $(this).addClass('active');
        $('.solve-btn').removeClass('active');
        $(this).css("opacity", "1");
        $('.solve-btn').css("opacity", "0.5");
        $('.solve-mission').css("display", "none");
        $('.request-mission').css("display", "block");
    })


    $("#datepicker").datepicker({
        showOn: "both",
        buttonText: '<i class="fa fa-calendar"></i>'
    });
    $("#datepicker").attr("autocomplete", "off");

    $('#timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 60,
        // minTime: '10',
        // maxTime: '6:00pm',
        defaultTime: '',
        startTime: '13:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,

    });
    $("#timepicker").attr("autocomplete", "off");

    function buttonenable() {
        let buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
            buttons[i].style.cursor = "pointer";
        }
    }

    function hrefenable() {
        let hrefs = document.getElementsByTagName('a');
        for (let i = 0; i < hrefs.length; i++) {
            hrefs[i].style.cursor = "pointer";
            hrefs[i].style.pointerEvents = "auto";

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

    function hrefunable() {
        let hrefs = document.getElementsByTagName('a');
        for (let i = 0; i < hrefs.length; i++) {
            hrefs[i].style.cursor = "default";
            hrefs[i].style.pointerEvents = "none";
        }
    }

    function settasks(res){
        var index=0;
        temp = []
        resultdate = []
        temp = res.filter((item,index)=>{
            var date = item.date.split('/');
            var year = date[2];
            var day = date[1];
            var month = date[0];
            var time = item.time.split(' ');
            var hour = parseInt(time[0].split(':'));
            var hour = (time[1][0] == 'P') ? hour + 12 : hour;
            var nowTime = new Date();
            var missiondate = new Date(year, month - 1, day, hour, 13, 00);
            if(missiondate.getTime() - nowTime.getTime() > 0){
                resultdate.push(missiondate)
                return true
            }
            else{
                return false
            }
        })

        for (var i = 0; i < temp.length; i++) {
            temp[i].date = resultdate[i];
            temp[i]["remain"] = 0;
            temp[i]["missionstate"] = false;
        }

        count = temp.length;
        vueinstance.tasks =temp
        $('.solve-btn').attr('data-before', count);
    }


    function setmembers(res){
        members = [];
        for (var i = 0; i < res.length; i++) {
            var temp = {};
            temp["icon"] = res[i].icon;
            temp["name"] = res[i].name;
            temp["account"] = res[i].account
            temp["on"] = false;
            members.push(temp);
        }
        vueinstance.members = members;
    }

    $('.checkconfirm').click(function(e) {
        buttonenable();
        hrefenable();
        $('.check').css("visibility", "hidden");
        $('.mask').css("visibility", "hidden");
    });


    $('#task_btn').click((event) => {
        event.preventDefault();
        $.post('./tasks', {
            content: $('#addTasks input[name=content]').val(),
            advise: $('#addTasks textarea[name=advise]').val(),
            date: $('#addTasks input[name=date]').val(),
            time: $('#addTasks input[name=time]').val(),
            author: localStorage.getItem("account"),
            classcode: localStorage.getItem("classcode"),
            region:$('.border')[0].id  //區域
        }, (res) => {
            buttonunable();
            hrefunable();
            $('#addTasks input[name=content]').val("");
            $('#addTasks textarea[name=advise]').val("");
            $('#addTasks input[name=date]').val("");
            $('#addTasks input[name=time]').val("");
            $('.check').css("visibility", "visible");
            $('.mask').css("visibility", "visible");
        });

    });
    $('#solve_btn').click((event) => {
        event.preventDefault()
        var classcode = localStorage.getItem("classcode");
        //get group tasks
        $.get('./tasks/' + classcode, {}, (res) => { 
            if (res === "null") {
                $('#solve_btn').data('0');
            } else {
                settasks(res);
                //res 區域和發起人圖片
                //get group member
                $.get('./users/' + classcode, {}, (res) => {
                    if (res === "null") {
                        console.log("123");
                    } else {
                        res.forEach(item => console.log(item));
                        setmembers(res);
                    }
                });
            }
        });
    });
});


async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/find/' + account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
        localStorage.setItem("classcode", res.classcode);
    });
}
