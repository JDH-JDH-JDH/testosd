function animatedslider_pluginAppObj_124_414() {
    var pluginAppObj_124_414Swiper,
        fullWidth = false,
        resizeTimer; // Set resizeTimer to empty so it resets on page load

    x5engine.boot.push(function(){           
        resizeAnimatedSwiper_pluginAppObj_124_414();
        loadSwiper();
    
		var pluginAppObj_124_414_resizeTo = null,
		pluginAppObj_124_414_width = 0;
		x5engine.utils.onElementResize(document.getElementById('pluginAppObj_124_414'), function (rect, target) {
			if (pluginAppObj_124_414_width == rect.width) {
				return;
			}
			pluginAppObj_124_414_width = rect.width;
			if (!!pluginAppObj_124_414_resizeTo) {
				clearTimeout(pluginAppObj_124_414_resizeTo);
			}
			pluginAppObj_124_414_resizeTo = setTimeout(function() {
				resizeAnimatedSwiper_pluginAppObj_124_414();
				loadSwiper();
			}, 50);
		});
    
    
    });

    function resizeAnimatedSwiper_pluginAppObj_124_414(){
        
        var container_width = $("#pluginAppObj_124_414").width();
        var heightUI = 1440;
        var widthUI  = 2560;
        var height = heightUI;
        var width = widthUI;
        var max_width = container_width;
        var controls_padding = 0
        var pagination_padding = 0 
        
        if (!fullWidth || false) {
            //obj in the bp ceil
            max_width = (container_width < width ? container_width : width);
            height = ((max_width - controls_padding) / width) * height;
                        
            width = max_width - controls_padding;
            $("#swiper_pluginAppObj_124_414").css({"width": max_width,"height": height + pagination_padding});
        }
        else {
            //obj fullwidth
            if (max_width > widthUI) {
                height = heightUI;
            }
            else {
                height = ((max_width - controls_padding) / widthUI) * height;
            }
            
            width = container_width - controls_padding;
            $("#swiper_pluginAppObj_124_414").css({"height": height + pagination_padding});
        }
            
        $("#pluginAppObj_124_414 .swiper-container.main").css({"width": width,"height": height});
        $("#pluginAppObj_124_414 .swiper-button-next, #pluginAppObj_124_414 .swiper-button-prev").css({"top": height/2});
    }

    function loadSwiper(){
    
        pluginAppObj_124_414Swiper = new Swiper4('#pluginAppObj_124_414 .swiper-container.main', {
        freeMode:            false,
        speed:               1000,
        loop:                true,
        loopPreventsSliding: true,
        direction:           'horizontal',
        roundLengths:        true,
        a11y: {
            enabled: true,
            prevSlideMessage: "Précédent",
            nextSlideMessage: "Suivant",
            paginationBulletMessage: "CLIQUEZ POUR LA DIAPOSITIVE {{index}}",
        },
        on: {
            slideChangeTransitionEnd: function () {
                let currentSlideEl = this.slides[this.realIndex];
                currentSlideEl.setAttribute("tabindex", "-1"); // make the element focusable only by calling focus() function
                currentSlideEl.focus({ preventScroll: true });
            },
        },
        navigation: {
 nextEl: '#pluginAppObj_124_414 .swiper-button-next',
 prevEl: '#pluginAppObj_124_414 .swiper-button-prev',
},
pagination: {
 clickable: true,
 el: '#pluginAppObj_124_414 .swiper-pagination',
 type: 'bullets',
},
 autoplay: {
 delay: 3000,
 disableOnInteraction: false,
},
 effect: 'cube',
 
        });
    }

}