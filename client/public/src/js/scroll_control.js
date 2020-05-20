function updateScroll(){
    var element = document.getElementById("color");
    element.scrollTop = element.scrollHeight;
}

setInterval(updateScroll,500);
