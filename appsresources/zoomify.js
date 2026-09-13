/*******************************************************************************************
 * zoomify
 * Written by Craig Francis
 * Absolutely minimal version of GSIV to work with touch screens and very slow processors.
********************************************************************************************

/*global window, document, setTimeout, getComputedStyle */
/*jslint white: true */

if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	//--------------------------------------------------
	// Variables

		var div_ref = null,
			div_half_width = null,
			div_half_height = null,
			img_ref = null,
			img_orig_width = null,
			img_orig_height = null,
			img_zoom_width = null,
			img_zoom_height = null,
			img_start_left = null,
			img_start_top = null,
			img_current_left = null,
			img_current_top = null,
			zoom_control_refs = {},
			zoom_level = 1,
			zoom_levels = [],
			zoom_level_count = [],
			click_last = 0,
			origin = null,
			html_ref = null;

	var Zoomify = {

	//--------------------------------------------------
	// Zooming

		image_zoom: function(change) {

			//--------------------------------------------------
			// Variables

				var new_zoom,
					new_zoom_width,
					new_zoom_height,
					ratio;

			//--------------------------------------------------
			// Zoom level
				new_zoom = (zoom_level + change);

				if (new_zoom >= zoom_level_count) {
					if (new_zoom > zoom_level_count) {
						div_ref.style.opacity = 0.5;
						setTimeout(function() {div_ref.style.opacity = 1;}, 150);
						return;
					}

				}

				if (new_zoom <= 0) {
					if (new_zoom < 0) {
						div_ref.style.opacity = 0.5;
						setTimeout(function() {div_ref.style.opacity = 1;}, 150);
						return;
					}
				}

				zoom_level = new_zoom;

			//--------------------------------------------------
			// New width

				new_zoom_width = zoom_levels[new_zoom];
				new_zoom_height = (zoom_levels[new_zoom] * (img_orig_height / img_orig_width));

				img_ref.width = new_zoom_width;
				img_ref.height = new_zoom_height;

			//--------------------------------------------------
			// Update position

				if (img_current_left === null) { // Position in the middle on page load

					img_current_left = (div_half_width - (new_zoom_width  / 2));
					img_current_top  = (div_half_height - (new_zoom_height / 2));

				} else {

					ratio = (new_zoom_width / img_zoom_width);

					img_current_left = (div_half_width - ((div_half_width - img_current_left) * ratio));
					img_current_top  = (div_half_height - ((div_half_height - img_current_top)  * ratio));

				}

				img_zoom_width = new_zoom_width;
				img_zoom_height = new_zoom_height;

				img_ref.style.left = img_current_left + 'px';
				img_ref.style.top  = img_current_top + 'px';

		},

		image_zoom_in: function () {
			self.image_zoom(1);
		},

		image_zoom_out: function () {
			self.image_zoom(-1);
		},

		scroll_event: function (e) {

			//--------------------------------------------------
			// Event

				e = e || window.event;

				var wheelData = (e.detail ? e.detail * -1 : e.wheelDelta / 40);

				self.image_zoom(wheelData > 0 ? 1 : -1);

			//--------------------------------------------------
			// Prevent default

				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

				return false;

		},

	//--------------------------------------------------
	// Movement

		event_coords: function (e) {
			var coords = [];
			if (e.touches && e.touches.length) {
				coords[0] = e.touches[0].clientX;
				coords[1] = e.touches[0].clientY;
			} else {
				coords[0] = e.clientX;
				coords[1] = e.clientY;
			}
			return coords;
		},
		image_move_update: function () {

			//--------------------------------------------------
			// Boundary check
				div_width = (div_half_width * 2);
				div_height = (div_half_height * 2);

				var max_left = (div_width - img_zoom_width),
					max_top = (div_height - img_zoom_height);

				if (img_current_left > 0)  				{ img_current_left = 0; }
				if (img_current_top  > 0) 				{ img_current_top  = 0; }
				if (img_current_left < max_left)        { img_current_left = max_left; }
				if (img_current_top  < max_top)         { img_current_top  = max_top;  }

			//--------------------------------------------------
			// Move

				img_ref.style.left = img_current_left + 'px';
				img_ref.style.top  = img_current_top + 'px';

		},
		/*image_move_update: function () {

			//--------------------------------------------------
			// Boundary check

				var max_left = (div_half_width - img_zoom_width),
					max_top = (div_half_height - img_zoom_height);

				if (img_current_left > div_half_width)  { img_current_left = div_half_width; }
				if (img_current_top  > div_half_height) { img_current_top  = div_half_height; }
				if (img_current_left < max_left)        { img_current_left = max_left; }
				if (img_current_top  < max_top)         { img_current_top  = max_top;  }

			//--------------------------------------------------
			// Move

				img_ref.style.left = img_current_left + 'px';
				img_ref.style.top  = img_current_top + 'px';

		},*/

		image_move_event: function (e) {

			//--------------------------------------------------
			// Calculations

				e = e || window.event;

				var currentPos = self.event_coords(e);

				img_current_left = (img_start_left + (currentPos[0] - origin[0]));
				img_current_top = (img_start_top + (currentPos[1] - origin[1]));

				self.image_move_update();

			//--------------------------------------------------
			// Prevent default

				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

				return false;

		},

		image_move_start: function (e) {

			//--------------------------------------------------
			// Event

				e = e || window.event;

				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false; // IE: http://stackoverflow.com/questions/1000597/
				}

			//--------------------------------------------------
			// Double tap/click event
				/* DISABLED: DOUBLECLICK REMOVE ZOOM
				var now = new Date().getTime();
				if (click_last > (now - 200)) {
					self.image_zoom_in();
				} else {
					click_last = now;
				}
				*/

			//--------------------------------------------------
			// Add events

					// http://www.quirksmode.org/blog/archives/2010/02/the_touch_actio.html
					// http://www.quirksmode.org/m/tests/drag.html

				if (e.type === 'touchstart') {

					img_ref.onmousedown = null;
					img_ref.ontouchmove = self.image_move_event;
					img_ref.ontouchend = function() {
						img_ref.ontouchmove = null;
						img_ref.ontouchend = null;
					};

				} else {

					document.onmousemove = self.image_move_event;
					document.onmouseup = function() {
						document.onmousemove = null;
						document.onmouseup = null;
					};

				}

			//--------------------------------------------------
			// Record starting position

				img_start_left = img_current_left;
				img_start_top = img_current_top;

				origin = self.event_coords(e);

		},

	//--------------------------------------------------
	// Default styles for JS enabled version

	//--------------------------------------------------
	// LORE

		init: function (container, image) { 
			self = this;
			div_ref = container;
			img_ref = image;
			img_current_left = null;
			img_current_top = null;
			if (div_ref && img_ref) {

				//--------------------------------------------------
				// Variables

					var div_border,
						div_style,
						div_width,
						div_height,
						width,
						height,
						button,
						buttons,
						name,
						len,
						k;

				//--------------------------------------------------
				// Wrapper size

					try {
						div_style = getComputedStyle(div_ref, '');
						div_border = div_style.getPropertyValue('border-top-width');
						div_half_width = div_style.getPropertyValue('width');
						div_half_height = div_style.getPropertyValue('height');
					} catch(e) {
						div_border = div_ref.currentStyle.borderWidth;
						div_half_width = div_ref.currentStyle.width;
						div_half_height = div_ref.currentStyle.height;
					}

					div_half_width = Math.round(parseInt(div_half_width, 10) / 2);
					div_half_height = Math.round(parseInt(div_half_height, 10) / 2);

				//--------------------------------------------------
				// Original size

					img_orig_width = img_ref.width;
					img_orig_height = img_ref.height;

				//--------------------------------------------------
				// Add zoom controls
/*
					buttons = [{'t' : 'in', 's' : 'on'}, {'t' : 'in', 's' : 'off'}, {'t' : 'out', 's' : 'on'}, {'t' : 'out', 's' : 'off'}];

					for (k = 0, len = buttons.length; k < len; k = k + 1) {

						button = buttons[k];
						name = button.t + '-' + button.s;

						zoom_control_refs[name] = document.createElement('div');
						zoom_control_refs[name].className = 'zoom-control zoom-' + button.t + ' zoom-' + button.s;

						if (button.t === 'in') {
							if (button.s === 'on') {
								zoom_control_refs[name].onmousedown = image_zoom_in; // onclick on iPhone seems to have a more pronounced delay
							}
						} else {
							if (button.s === 'on') {
								zoom_control_refs[name].onmousedown = image_zoom_out;
							}
						}

						if (button.s === 'on') {
							try {
								zoom_control_refs[name].style.cursor = 'pointer';
							} catch(err) {
								zoom_control_refs[name].style.cursor = 'hand'; // Yes, even IE5 support
							}
						}

						div_ref.appendChild(zoom_control_refs[name]);

					}
*/
				//--------------------------------------------------
				// Zoom levels

					//--------------------------------------------------
					// Defaults

						div_width = (div_half_width * 2);
						div_height = (div_half_height * 2);

						width = img_orig_width;
						height = img_orig_height;
						
						zoom_levels = [];
						zoom_levels[0] = width;

						do{
							width = (width * 0.75);
							height = (height * 0.75);

							if(height < div_height){
								height = div_height;
								width = div_height * (img_orig_width / img_orig_height);
							}

							if(width < div_width){
								width = div_width;
							}
							zoom_levels[zoom_levels.length] = Math.round(width);

						} while (width > div_width && height > div_height)

						zoom_levels.reverse(); // Yep IE5.0 does not support unshift... but I do wonder if a single reverse() is quicker than inserting at the beginning of the array.

					//--------------------------------------------------
					// Mobile phone, over zoom

						if (parseInt(div_border, 10) === 5) { // img width on webkit will return width before CSS is applied
							zoom_levels[zoom_levels.length] = Math.round(img_orig_width * 1.75);
							zoom_levels[zoom_levels.length] = Math.round(img_orig_width * 3);
						}

					//--------------------------------------------------
					// Set default

						zoom_level_count = (zoom_levels.length - 1);

						self.image_zoom(0);

				//--------------------------------------------------
				// Make visible

					img_ref.style.visibility = 'visible';
					
					div_ref.className = div_ref.className + ' js-active';

				//--------------------------------------------------
				// Add events

				img_ref.onmousedown = self.image_move_start;
				img_ref.ontouchstart = self.image_move_start;

				if (div_ref.addEventListener) {

					div_ref.addEventListener('DOMMouseScroll', self.scroll_event, false);
					div_ref.addEventListener('mousewheel', self.scroll_event, false);

				} else if (div_ref.attachEvent) {

					div_ref.attachEvent('onmousewheel', self.scroll_event);

				}

				document.onkeyup = function(e) {

					var keyCode = (e ? e.which : window.event.keyCode);

					if (keyCode === 37 || keyCode === 39) { // left or right

						self.img_current_left = (self.img_current_left + (keyCode === 39 ? 50 : -50));

						self.image_move_update();

					} else if (keyCode === 38 || keyCode === 40) { // up or down

						self.img_current_top = (self.img_current_top + (keyCode === 40 ? 50 : -50));

						self.image_move_update();

					} else if (keyCode === 107 || keyCode === 187 || keyCode === 61) { // + or = (http://www.javascripter.net/faq/keycodes.htm)

						self.image_zoom_in();

					} else if (keyCode === 109 || keyCode === 189) { // - or _

						self.image_zoom_out();

					}

				};

			}

		}
	};



	$.fn.zoomify = function( image ) {
		return this.each(function() {

			var zoomify_obj = Object.create( Zoomify );

			zoomify_obj.init( this, image );

			$.data( this, 'Zoomify', zoomify_obj );

		});
	};

	$.fn.changeZoom = function( delta ) {
		return this.each(function() {

			var zoomify_obj = $.data( this, 'Zoomify' );
			if(typeof(zoomify_obj) != undefined){
				zoomify_obj.image_zoom(delta)
			}
		});
	};

})( jQuery, window, document );
