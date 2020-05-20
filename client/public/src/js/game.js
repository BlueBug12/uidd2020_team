$(document).ready(function() {
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

    $('.accept').click(function() {
        $(this).addClass('press');
        $(this).css("opacity", "0.5");
        $(this).siblings('.judge').removeClass('press');
        $(this).siblings('.judge').css("opacity", "1");
    })

    $('.judge').click(function() {
        $(this).addClass('press');
        $(this).css("opacity", "0.5");
        $(this).siblings('.accept').removeClass('press');
        $(this).siblings('.accept').css("opacity", "1");
    })

    $('.member').click(function() {
        $(this).toggleClass("on");
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
            author:localStorage.getItem("account"),
            classcode:localStorage.getItem("classcode")
        }, (res) => {
            console.log(res);
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
        //var classcode = localStorage.getItem("classcode");
        $.get('./tasks', {}, (res) => {
            console.log(res);
            if(res === "null"){
                console.log("123");
            }
            else{
            var num = res.length;
            console.log(num);
            console.log(res[0].content);
            }
        });
    });



});

async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
        localStorage.setItem("classcode", res.classcode);
    }); 
}