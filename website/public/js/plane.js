planeySize = function () {
    // Get the real width of the planey image
    var plane = $("#plane");
    var newImage = new Image();
    newImage.src = plane.attr("src");
    var imgWidth = 310;
    
    // distance over which zoom effect takes place
    var maxScrollDistance = 1000;
    
    // set to window height if larger
    maxScrollDistance = Math.min(maxScrollDistance, $(window).height());
    
    // width at maximum zoom out (i.e. when window has scrolled maxScrollDistance)
    var widthAtMax = 250;
    
    // calculate diff and how many pixels to zoom per pixel scrolled
    var widthDiff = imgWidth - widthAtMax;
    var pixelsPerScroll =(widthDiff / maxScrollDistance);

    $(window).scroll(function () {
        // the currently scrolled-to position - max-out at maxScrollDistance
        var scrollTopPos = Math.min($(document).scrollTop(), maxScrollDistance);
        
        // how many pixels to adjust by
        var scrollChangePx =  Math.floor(scrollTopPos * pixelsPerScroll);
        
        // calculate the new width
        var zoomedWidth = imgWidth - scrollChangePx;
        
        // set the width
        $('.planey').css('width', zoomedWidth);
    });
};

planeySize();
$(document).ready(function() {
    
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
    
        /* Check the location of each desired element */
        $('.hideme').each( function(i){
            
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){
                
                $(this).animate({'opacity':'1'},500);
                    
            }
            
        }); 
    
    });
    
});