(function($){

	var body = $("body"),
	skiil_bar_width,
	 
	scrollEvent = {
		
		displays: $(".display_js"),
		last_display: null,
		height_header: $(".fixed-panel").outerHeight(),
	
		init: function(){
			
			var display_active = scrollEvent.getActiveDisplay();
			
			scrollEvent.setBodyId(display_active);
			scrollEvent.initAnimationDisplay(display_active);
			
			$(document).on("scroll", function(){
			
				scrollEvent.setActiveDisplay();
				
			});
			
			$(".init-scroll_js").on("click", function(event){
			
				event.preventDefault();
				scrollEvent.scroll($(this));
				
			});
			
			scrollEvent.last_display = scrollEvent.displays.last();
			scrollEvent.last_display.prev().addClass("display-prev-last_js");
		},
		
		getActiveDisplay: function(){
		
			var window_top = $(window).scrollTop(),
			offsetTop, display_active, cache;
			
			display_active = scrollEvent.displays.filter(function(index, element){
			
				cache = $(element);
				offsetTop = cache.offset().top - scrollEvent.height_header;
				return window_top >= offsetTop && window_top < offsetTop + cache.outerHeight();
				
			});
			
			return display_active;
		},

		setActiveDisplay: function(){
			
			var window_top = $(window).scrollTop(),
			display_active = scrollEvent.getActiveDisplay();
				
			if(!display_active.hasClass("display_active")){	
			
				scrollEvent.initAnimationDisplay(display_active);
				scrollEvent.setBodyId(display_active);
				display_active.addClass("display_active").siblings(".display_js").removeClass("display_active");
				$("[data-scroll-nav=" + scrollEvent.displays.index(display_active) + "]").addClass("nav__link_active").siblings().removeClass("nav__link_active");
			
			}
			
			if(!scrollEvent.last_display.hasClass("active_container") && display_active.hasClass("display-prev-last_js") && window_top > display_active.offset().top + display_active.outerHeight() / 2){

				scrollEvent.initAnimationDisplay(scrollEvent.last_display);
					
			}				
		},
		
		setBodyId: function(display_active){
		
			body.attr("id", display_active.attr("id") + "_active");	
		
		},
		
		initAnimationDisplay: function(display_active){
		
			if(!display_active.hasClass("active_container")){

				$(this).magicLayout({
					
					container: display_active
					
				});
				
			}
			
		},
		
		scroll: function(element){

			var	display_active = $('#' + element.attr("data-id-section")); 

			$("html, body").animate({scrollTop: display_active.offset().top - scrollEvent.height_header}, 1200);
			body.removeClass("nav-panel_active");
			scrollEvent.setBodyId(display_active);

			setTimeout(function(){
				
				scrollEvent.initAnimationDisplay(display_active);
				
			}, 1100);
			
		}
		
	}; 
	 
	scrollEvent.init();
	
	body.addClass("load-page");
	$(".prelodader-animation_js").hide();
	
	$(".skill-bar_js").map(function(){
		
		skiil_bar_width = $(this).attr("data-skill-bar-width");
		$(this).width(skiil_bar_width).find(".skill__value_js").text(skiil_bar_width);

	});
	
	$(".mobile-menu-open_js").on("click", function(){
		
		body.addClass("nav-panel_active");
		
	});
	
	$(".mobile-menu-close_js").on("click", function(){
		
		body.removeClass("nav-panel_active");
		
	});
	
	$(".open-popup_js").on("click", function(event){
		
		event.preventDefault();
		
		$(this).LayerPopup({
			
			container: $("#" + $(this).attr("data-id"))
			
		});
		
	});
	
	$(".popup__close_js").on("click", function(){
		
		var active_popup = $(this).parents(".lrmw_active_popup");
		$(this).LayerPopup("closePopup", active_popup, true);
		
	});

	setTimeout(function(){
		
		$(".preloader_js").hide();
		
	}, 1000);
	
})(window.jQuery);
