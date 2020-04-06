$(function(){
  $('#know-more').on('click',function(){
    $('#topic,#know-more').addClass('animated fadeOut')
    $('#darker-bg').animate({opacity:"0"}).css("z-index","-1")
    $('#top-house').animate({bottom:"60%"},1000)
    $('#bottom-house').animate({bottom:"40%"},1000)
    $('#base').animate({bottom:"38%"},1000)
    $('#houseworks').delay(1400).css('visibility','visible')
		$('#w1').delay(1400).addClass('animated fadeInUp')
		$('#w2').delay(1400).addClass('animated fadeInDown')
		$('#w3').delay(1400).addClass('animated fadeInUp')
		$('#w4').delay(1400).addClass('animated fadeInDown')
		$('#w5').delay(1400).addClass('animated fadeInUp')
    $('#sub-section-2').css('visibility','hidden')

    $('html, body').delay(2500).animate({ scrollTop: $('#section_2').offset().top}, 500, 'linear',function(){ 
        $('#sub-section-2').addClass('animated bounceInDown').css('visibility','visible')
    })
		
  })
})
/*
$(function () {
  $(window).scroll(function () {
    var scrollVal = $(this).scrollTop();
    console.log(scrollVal);
  });
});

$(function() {
    $('a[href*=\\#]').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
  });
});*/
