$(function(){
  $('body').css({"overflow-y": "hidden"})
  $('#know-more').on('click',function(){
    $('#topic,#know-more').addClass('animated fadeOut')
    $('#darker-bg').animate({opacity:"0"}).css("z-index","-1")
    $('#top-house').css({top: "calc(-10.3vh + 80px)", transition: "1s"})
    $('#bottom-house').css({top: "calc(-4vh + 80px)", transition: "1s"})
    $('#base').css({top: "calc(2.5vh + 80px)", transition: "1s"})
    $('#houseworks').delay(1400).css('visibility','visible')
		$('#w1').delay(1400).addClass('animated fadeInUp')
		$('#w2').delay(1400).addClass('animated fadeInDown')
		$('#w3').delay(1400).addClass('animated fadeInUp')
		$('#w4').delay(1400).addClass('animated fadeInDown')
		$('#w5').delay(1400).addClass('animated fadeInUp')
    $('#sub-section-2').css('visibility','hidden')

    setTimeout(() => {
        $('body').css("overflow-y", "scroll")
    }, 2400)
    $('html, body').delay(2000).animate({ scrollTop: $('#section_2').offset().top}, 500, 'linear',function(){ 
        $('#sub-section-2').addClass('animated bounceInDown').css('visibility','visible')
    })
    $('#know-more').transition('fade');

    $('#top-house').css({transition: "0s"})
    $('#bottom-house').css({transition: "0s"})
    $('#base').css({transition: "0s"})

  })
})

$(function() {
  var state = 0;

  const track = document.querySelector('.carousel_track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel_button')


  const setSlidePosition = (slide, index) => {
      slide.style.left = 24.6 * index + 'vw'
  }
  slides.forEach(setSlidePosition);


  const moveToSlide = async (track, currentSlide, targetSlide) => {
      $('.carousel_track').css({transition: "transform 2s ease-in"});
      track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
      currentSlide.classList.remove('current-slide');
      targetSlide.classList.add('current-slide');
      return new Promise(resolve => {
          setTimeout(() => {
              resolve();
          }, 2000);
      })
  }

  
  nextButton.addEventListener('click', async e => {
      const currentSlide = track.querySelector('.current-slide');
      const nextSlide = currentSlide.nextElementSibling;
      if (state == 0) {
          $('#w4_orange').css({opacity: 1});
          $('#w4_orange').css("z-index", "20");
          $('#w4_orange').css("transform", "scale(3.0)");
          $('.disappear').transition({ animation: 'fade left', duration: '3s' });
          $('.fadeout').css({"transform": "scale(3.0)", opacity: 0, transition: '3s'});
          await moveToSlide(track, currentSlide, nextSlide);
          $('.carousel_track').css({transition: "0s"});
          state = 1;
          return;
      }
      if (state == 1) {
          $('.example').animate({ opacity: 1.0 }, 2000);
          $('#w4_orange').css({
              "transform": "scale(1.4)",
              left: "27.5vw",
              top: "42vh"
          });
          setTimeout(() => {
              $('#w4_orange').css({transition: "0s"});
          }, 3000);
          await moveToSlide(track, currentSlide, nextSlide);
          $('.carousel_track').css({transition: "0s"});
          state = 2;
          return;
      }
  })

})
