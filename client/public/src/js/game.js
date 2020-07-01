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
            tasks: tasks,
            shows: [],
            countdown: [],
            temprole: ''
        },
        methods: {
            showPanel: function(panelIndex) {
                for (var i = 0; i < this.shows.length; i++) {
                    this.$set(this.shows, i, false);
                }
                temp = document.getElementsByClassName('border');
                temp[0].classList.remove('border');
                showcurrentfloor(this.tasks[panelIndex].region)
                this.$set(this.shows, panelIndex, true);

            },
            memberchoose: function(index, mindex) {
                if (this.tasks[index].members[mindex].on == false)
                    this.$set(this.tasks[index].members[mindex], 'on', true)
                else
                    this.$set(this.tasks[index].members[mindex], 'on', false)
            },
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
                    document.getElementById(this.tasks[index].region).classList.remove('border')
                        //count = temp.length;
                        //$('.solve-btn').attr('data-before', count);
                        //clearTimeout
                    this.$delete(this.tasks, index)
                    count = this.tasks.length;
                    $('.solve-btn').attr('data-before', count);
                }
            },

            turnright: function(index) {
                var temp = this.tasks[index].members.pop();
                this.tasks[index].members.unshift(temp);
            },
            turnleft: function(index) {
                var temp = this.tasks[index].members.shift();
                this.tasks[index].members.push(temp);
            },
            accept: function(index) {
                var invite_before = this.tasks[index].members.filter((item) => {
                    return item.on
                })
                var invite_after = []
                for (var i = 0; i < invite_before.length; i++) {
                    invite_after.push({id:invite_before[i].account,state:1})
                }
                console.log(invite_after);
                $.get('./tasks/isaccepted' , {id:this.tasks[index]._id}, (resup) => {
                    console.log(resup)
                    if (resup.isaccepted == true) {
                        $('.alert-mess').text('任務已被搶走囉!')
                  
                    } else {
                        $('.alert-mess').text('任務已接受')
                        $.post('./tasks/participate', {
                            id: this.tasks[index]._id,
                            invite: invite_after,
                            participate: [{id:localStorage.account,state:1,icon:$('#UserImg').css('background-image').replace(/(url\(|\)|")/g, '')}]
                        }, (res) => {
                        });
                    }
                    document.getElementById(this.tasks[index].region).classList.remove('border')
                    this.$delete(this.tasks, index)
                    count = this.tasks.length;
                    $('.solve-btn').attr('data-before', count);
                    buttonunable();
                    hrefunable();
                    $('.check').css("visibility", "visible");
                    $('.mask').css("visibility", "visible");   
                });
            }
        },
        watch: {
            tasks: {
                handler() {
                    if (this.tasks.length != 0) {
                        this.shows = [];
                        this.countdown = []
                        for (var i = 0; i < this.tasks.length; i++) {
                            this.shows.push(false);
                            this.countdown.push(true);
                            this.remaintime(i);
                        }
                        this.shows[0] = true;
                        this.countdown[0] = true;
                        this.remaintime(0);
                        //var reg = document.getElementById()
                        //console.log(this.tasks[0].region)
                        showcurrentfloor(this.tasks[0].region)
                        //reg.classList.add('border')
                        if($('.exchange').hasClass('no_task')){
                            $('.exchange').removeClass('no_task')
                        }
                    }
                    else{
                        $('.exchange').addClass('no_task')
                        this.shows = [];
                        this.countdown = [];
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


    function showcurrentfloor(id){
        end = parseInt(id.indexOf("room"))
        current = parseInt(id.substring(0,end))
        var floors = document.querySelectorAll("#floors > div").length;
        if(choose_region){
            if(choose_region[0] == current){
                $('#'+choose_region).removeClass('border')
            }
        }
        genPanel(current-1,0)
        $(`#${id}`).addClass('border')
        for(var i = 0;i < floors;i++){
            if(i+1 == current){
                $(`#floor_animate${i}`).css({background: 'rgb(121, 159, 180)' }); 
            }
            else{
                $(`#floor_animate${i}`).css({ background: 'rgb(196, 213, 217)' });
            }
        }
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
        document.getElementById("floors").addEventListener('mouseenter', onMouseEnterFloor);
        document.getElementById("floors").addEventListener('mouseleave', onMouseLeaveFloor);
        var floor = document.querySelectorAll("#floors > div").length;
        var i = 0;
        if(choose_region == null){
            genPanel(0,1)         
        }
        else{
            genPanel(choose_region[0]-1,1)          
        }
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

    function settasks(res) {
        var index = 0;
        rec_task = res.task
        rec_user = res.user
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
            rec_task[i]["missionstate"] = false;
            rec_task[i]["members"] = [];
            index=0;
            for(var k= 0;k < rec_user.length;++k){
               if(rec_task[i].author != rec_user[k].account){
                    rec_task[i]["members"][index] = rec_user[k];
                    index++;
                }
            }
            for (var j = 0; j < rec_task[i]["members"].length; j++) {
                rec_task[i]["members"][j]["on"] = false;
            }
        }

        count = rec_task.length;
        vueinstance.tasks = rec_task;
        $('.solve-btn').attr('data-before', count);
    }




    $('.checkconfirm').click(function(e) {
        buttonenable();
        hrefenable();
        $('.check').css("visibility", "hidden");
        $('.mask').css("visibility", "hidden");
    });


    function error(errorarray, errortime, errorpoint) {
        if (errorarray.length > 0) {
            var str = errorarray.join(',')
            str = str + '為必須'
            $('#error_space').text(str);
            $('#error_space').addClass('err');
        }
        if (errortime) {
            if (errorpoint) {
                $('#error_type').text('積分與時間數值錯誤~');
                $('#error_type').addClass('err');
            } else {
                $('#error_type').text('時間是回不去的~');
                $('#error_type').addClass('err');
            }
        } else if (errorpoint) {
            $('#error_type').text('要輸入正確數值喔~');
            $('#error_type').addClass('err');
        }
    }

    function clear() {
        $('#error_space').text("");
        $('#error_type').text("");
        $('#inputcontent').text("");
        $('#inputsuggest').text("");
        $('#datepicker').text("");
        $('#timepicker').text("");
        $('#inputpoint').text("");
    }

    function check() {
        clear();
        const inputcontent = $('#inputcontent').val().trim();
        const inputsuggest = $('#inputsuggest').val().trim();
        const datepicker = $('#datepicker').val().trim();
        const timepicker = $('#timepicker').val().trim();
        const region = $('.head').text();
        const point = $('#inputpoint').val().trim();
        let error_space = []
        let error_time = false
        let error_point = false
        var pattern = /^[1-9]\d*$/;
        let ans = true;

        if (region == "任務地點") {
            error_space.push('地點')
            ans = false;
        }

        if (point == "") {
            error_space.push('點數')
            ans = false;
        } else if (!pattern.test(point)) {
            error_point = true
            ans = false
        }

        if (inputcontent == "") {
            error_space.push('內容')
            ans = false;
        }

        if (inputsuggest == "") {
            error_space.push('建議')
            ans = false;
        }

        if (datepicker == "") {
            error_space.push('日期')
            ans = false;
        }

        if (timepicker == "") {
            error_space.push('時間')
            ans = false;
        }

        if (datepicker != "" && timepicker != "") {
            var date = datepicker.split('/');
            var year = date[2];
            var day = date[1];
            var month = date[0];
            var time = timepicker.split(' ');
            var hour = parseInt(time[0].split(':'));
            var hour = (time[1][0] == 'P') ? hour + 12 : hour;
            var nowTime = new Date();
            var missiondate = new Date(year, month - 1, day, hour, 00, 00);
            if (missiondate.getTime() - nowTime.getTime() <= 0) {
                error_time = true;
                ans = false;
            }
        }

        error(error_space, error_time, error_point);

        return ans;

    }



    $('#task_btn').click((event) => {
        event.preventDefault();
        if (check() == true) {
            $.post('./tasks', {
                content: $('#addTasks input[name=content]').val(),
                advise: $('#addTasks textarea[name=advise]').val(),
                date: $('#addTasks input[name=date]').val(),
                time: $('#addTasks input[name=time]').val(),
                author: localStorage.getItem("account"),
                classcode: localStorage.getItem("classcode"),
                icon:  $('#UserImg').css('background-image').replace(/(url\(|\)|")/g, ''),
                region: $('.border')[0].id,
                point: $('#inputpoint').val(),
                region_content: $('.head').text()
            }, (res) => {
                clear();
                var i = 0;
                var floor = document.querySelectorAll("#floors > div").length;
                for (j = 0;j < floor;j++){
                    i = 0;
                    while (temp = document.getElementById((j+1)+"room" + i)) {
                        if (temp.classList.contains('border')) {
                            temp.classList.remove('border')
                        }
                        choose_region = null
                        i = i + 1;
                    }
                }
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>任務地點');
                buttonunable();
                hrefunable();
                $('#inputpoint').val("")
                $('.alert-mess').text('任務已發布')
                $('#addTasks input[name=content]').val("");
                $('#addTasks textarea[name=advise]').val("");
                $('#addTasks input[name=date]').val("");
                $('#addTasks input[name=time]').val("");
                $('.check').css("visibility", "visible");
                $('.mask').css("visibility", "visible");
            });
        }
    });
    $('#solve_btn').click((event) => {
        if($('.exchange').hasClass('no_task')){
            $('.exchange').removeClass('no_task')
        }
        document.getElementById("floors").removeEventListener('mouseenter', onMouseEnterFloor);
        document.getElementById("floors").removeEventListener('mouseleave', onMouseLeaveFloor);
        var floor = document.querySelectorAll("#floors > div").length;
        var i = 0;
        for (var j = 0;j < floor;j++){
            i = 0;
            $(`#floor_animate${j}`).css({ top: `calc(${30*(floor-1-j)}px + 50vh)` });
            while (temp = document.getElementById((j+1)+"room" + i)) {
                temp.setAttribute("pointer-events", "none");
                if (temp.classList.contains('border')) {
                    temp.classList.remove('border');
                    console.log(temp)
                }
                i = i + 1
            }
        }
        event.preventDefault()
        var classcode = localStorage.getItem("classcode");
        //get group tasks
        $.get('./tasks/' + classcode, {}, (resup) => {
            if (resup === "null") {
                $('#solve_btn').data('0');
            } else {
                console.log(resup);
                settasks(resup)
            }
        });
    });

});
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
function getUser() {
    var account = localStorage.getItem("account");
    $.get('./users/find/' + account, {}, (res) => {
        //document.getElementById("UserImg").src = res.icon;
        document.getElementById("UserImg").style.backgroundImage= `url(${res.icon})`;
        localStorage.setItem("classcode", res.classcode);
    });
}
