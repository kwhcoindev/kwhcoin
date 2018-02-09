/*(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // using AMD; register as anon module
        console.log("Hellow");
        define(['jquery'], factory);
    } else {
        // no AMD; invoke directly
        console.log("No amd Hellow");
        factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
    }
}
(function($){

  $(document).ready(function(){
    
    function checkScrollTop(){
      if ($(window).scrollTop()< 80){
        $('#mainNav').removeClass('navbar-stuck');
        $('#toTop').hide();
      }
      else{
        $('#mainNav').addClass('navbar-stuck');
        $('#toTop').show();
      }
    }

    $('#toTop').on('click', function(){
      $('html,body').animate({'scrollTop':0});
    });

    checkScrollTop();
    
    $(window).scroll(function(){
      checkScrollTop();
    });

  });

}));
*/