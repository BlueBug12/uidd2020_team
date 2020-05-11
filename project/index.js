$(document).ready(function() {

    $('#task_btn').click((event) => {
        event.preventDefault()
        $.post('./tasks', {
            content: $('#addTasks input[name=content]').val(),
            advise:$('#addTasks textarea[name=advise]').val(),
            date:$('#addTasks input[name=date]').val(),
            time:$('#addTasks input[name=time]').val()
        }, (res) => {
            console.log(res);
        });
    });
    $('#solve_btn').click((event) => {
        event.preventDefault()
        $.get('./tasks', {
        }, (res) => {
            console.log(res);
            var num = res.length;
            console.log(num);
            console.log(res[0].content);
        });
    });

});