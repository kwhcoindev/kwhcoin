(function($){

  jQuery(document).ready(function(){
    
    function checkScrollTop(){
      if (jQuery(window).scrollTop()< 80){
        jQuery('#mainNav').removeClass('navbar-stuck');
        jQuery('#toTop').hide();
      }
      else{
        jQuery('#mainNav').addClass('navbar-stuck');
        jQuery('#toTop').show();
      }
    }

    jQuery('#toTop').on('click', function(){
      jQuery('html,body').animate({'scrollTop':0});
    });

    checkScrollTop();
    
    jQuery(window).scroll(function(){
      checkScrollTop();
    });

  });
})();
