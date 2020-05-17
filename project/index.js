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



    var count = $(".buttonContainer").children().length;
    $('.solve-btn').attr('data-before', count);
    var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
    var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");

    function showPanel(panelIndex) {
        tabButtons.forEach(function(node) {
            node.style.backgroundColor = "#F2D7AD";
            node.style.color = "";
        });
        tabButtons[panelIndex].style.backgroundColor = "#F7F6E4";
        tabButtons[panelIndex].style.color = "white";
        tabPanels.forEach(function(node) {
            node.style.display = "none";
        });
        tabPanels[panelIndex].style.display = "block";
        tabPanels[panelIndex].style.backgroundColor = "#F7F6E4";
    }
    showPanel(0);
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

    $('#task_btn').click((event) => {
        event.preventDefault()
        $.post('./tasks', {
            content: $('#addTasks input[name=content]').val(),
            advise: $('#addTasks textarea[name=advise]').val(),
            date: $('#addTasks input[name=date]').val(),
            time: $('#addTasks input[name=time]').val()
        }, (res) => {
            console.log(res);
        });
    });
    $('#solve_btn').click((event) => {
        event.preventDefault()
        $.get('./tasks', {}, (res) => {
            console.log(res);
            var num = res.length;
            console.log(num);
            console.log(res[0].content);
        });
    });

});