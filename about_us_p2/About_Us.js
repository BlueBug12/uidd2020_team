$(function() {
    var touch = document.body;
    var click = 0;
    var state = 0;
    var trash_pos = $('#w4_orange').position();
    touch.onclick = function() {
        if (click == 0) {
            document.getElementById('w4').style.visibility = 'hidden';
            click = 1;
            return;
        }
    };

    const track = document.querySelector('.carousel_track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel_button')
    const slideWidth = slides[0].getBoundingClientRect().width;


    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px'
    }
    slides.forEach(setSlidePosition);


    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    }

    ;
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        moveToSlide(track, currentSlide, nextSlide);
        if (state == 0) {
            $('#w4_orange').css("z-index", "20");
            $('#w4_orange').css("transform", "scale(3.0)");
            $('.disappear').transition({ animation: 'fade left', duration: '3s' });
            state = 1;
            return;
        }
        if (state == 1) {
            $('.example').animate({ opacity: 1.0 }, 2000);
            var x = trash_pos.left - (parseInt($(document).width()) / 3.5);
            var y = trash_pos.top - (parseInt($(document).height()) / 2.8);
            x = -x;
            y = -y;
            $('#w4_orange').css("transform", "translate3d(" + x + "px," + y + "px,0)");
            var x_per = (2 / 3.5) * 100;
            var y_per = (1 / 2.8) * 100;
            $('#w4_orange').css("left", x_per + "%");
            $('#w4_orange').css("top", y_per + "%");
            console.log(trash_pos.left / parseInt($(document).width()));
            console.log(trash_pos.top / parseInt($(document).height()));
            state = 2;
            return;
        }
    })

    var back_1 = document.getElementById('back_1');
    back_1.style.width = document.querySelector('.fir').getBoundingClientRect().width + 'px';
    var back_2 = document.getElementById('back_2');
    console.log(back_2);
    back_2.style.width = document.querySelector('.seco').getBoundingClientRect().width + 'px';
    var back_3 = document.getElementById('back_3');
    back_3.style.width = document.querySelector('.thr').getBoundingClientRect().width + 'px';

})