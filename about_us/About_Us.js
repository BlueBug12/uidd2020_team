$(function(){
  $('#know-more').on('click',function(){
    $('#topic').transition('fade',300)
    $(this).transition('fade',300)
    $('#top-house').animate({bottom:"40%"})
    $('#bottom-house').animate({bottom:"0%"})
    $('#houseworks').css('visibility','visible')
		$('.works').addClass('animated fadeIn')
  })
})
