$(function(){
  $('#know-more').on('click',function(){
    $('#topic').transition('fade',300)
    $(this).transition('fade',300)
    $('#darker-bg').animate({opacity:"0"}).css("z-index","-1")
    $('#top-house').animate({bottom:"40%"})
    $('#bottom-house').animate({bottom:"0%"})
    $('#base').animate({bottom:"-7%"})
    $('#houseworks').delay(300).css('visibility','visible')
		$('.works').delay(300).addClass('animated fadeIn')
   // $('#bottom-house,#top-house,#base').delay(2000).animate({width:"30vw"})
   // $('#w1,#w2,#w3,#w4,#w5').delay(2000).animate({width:"1vw"})
   // $('#top-house').delay(2000).animate({width:"30vw"}) 
   // $('#base').delay(2000).animate({width:"30vw"})

    $('html, body').delay(2000).animate({ scrollTop: $('#section_2').offset().top}, 500, 'linear');
		
		/*
    $('#section_1_sub').delay(2000).animate({
      top:"50vh",
      left:"5vw",
      width:"40vw",
      height:"30vh"})*/
  })
})

/*
$(function() {
    $('a[href*=\\#]').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
  });
});*/
