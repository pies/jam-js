// >> from http://adomas.org/javascript-mouse-wheel/

/** This is high-level function.
 * It must react to delta being more/less than zero.
 */
function handle(delta) {
        if (delta < 0)
		…;
        else
		…;
}

/** Event handler for mouse wheel event.
 */
function wheel(event){
	var delta = 0;

	/* For IE. */
	if (!event) {
		event = window.event;
	}
	
	/* IE/Opera. */
	if (event.wheelDelta) { 
		delta = event.wheelDelta/120;
		/** In Opera 9, delta differs in sign as compared to IE. */
		if (window.opera) {
			delta = -delta;
		} 
		/** Mozilla case. */
	}
	else if (event.detail) { 
	/** In Mozilla, sign of delta is different than in IE.
	* Also, delta is multiple of 3. */
		delta = -event.detail/3;
	}
	/** If delta is nonzero, handle it.
	* Basically, delta is now positive if wheel was scrolled up,
	* and negative, if wheel was scrolled down.
	*/
	if (delta) handle(delta);
}

/** Initialization code. 
 * If you use your own event management code, change it as required.
 */
if (window.addEventListener)
        /** DOMMouseScroll is for mozilla. */
        window.addEventListener('DOMMouseScroll', wheel, false);
/** IE/Opera. */
window.onmousewheel = document.onmousewheel = wheel;

// <<