function animatedimage_pluginAppObj_31_47() {
    
    x5engine.boot.push(function(){
        
        //Triggering the back side visibility
        switch("mouseover"){
            case "click":
                $('#iandt_pluginAppObj_31_47 .wrapper').click( function(){
                    $(this).toggleClass('back-visible');
                });
                break;
            case "timer":
                setInterval(function() {
                    $('#iandt_pluginAppObj_31_47 .wrapper').toggleClass('back-visible');
                },2000);
                break;
            case "mouseover":
                $('#iandt_pluginAppObj_31_47 .wrapper').hover(function(){
                    $(this).addClass('back-visible');
                }, function(){
                    $(this).removeClass('back-visible');
                });
                break;
        }
        
         $('#imContent').on('breakpointChangedOrFluid', function (e, breakpoint) {
            resizeIaT_pluginAppObj_31_47();
          });

         resizeIaT_pluginAppObj_31_47();
    });

    //Proportional resize for responsive behavior
    function resizeIaT_pluginAppObj_31_47(){
        
        var w = 250;
        var h = 250  
        var containerWidth = $('#pluginAppObj_31_47').width();
        var fact = containerWidth < w ? containerWidth / w : 1;
        
        $('#pluginAppObj_31_47 .wrapper, #pluginAppObj_31_47 .sides-container, #pluginAppObj_31_47 .text-container').css( {width: w * fact, height: h * fact} );
    }
}