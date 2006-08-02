
extend('JAM.Dom.Element', {

	opacity: function() {
		return arguments.length? 
			(arguments[0]? this.setOpacity(arguments[0]): this.clearOpacity()): 
			this.getOpacity();
	},

	// >> from Dojo
	/* float between 0.0 (transparent) and 1.0 (opaque) */
	setOpacity: function (opacity) {
		if (JAM.Browser.is('IE')){
			if (this.nodeName.toUpperCase() == "TR"){
				// FIXME: is this too naive? will we get more than we want?
				$$('TD', this).limitTo(this.childNodes)
					.css('filter', 'Alpha(Opacity='+opacity*100+')');
			}
			this.css('filter', 'Alpha(Opacity='+opacity*100+')');
		}
		else {
			this.css({ opacity: opacity });
			if (JAM.Browser.is('FF')) this.css({ MozOpacity: opacity });   // FF 1.0 directly supports "opacity"
			if (JAM.Browser.is('S'))  this.css({ KhtmlOpacity: opacity }); // S 1.3 directly supports "opacity"
		}
	},
		
	getOpacity: function () {
		var value = JAM.Browser.is('IE')?
			((this.filters && this.filters.alpha && isNumber(this.filters.alpha.opacity)? this.filters.alpha.opacity: 100) / 100):
			(this.getStyle('opacity') || this.getStyle('MozOpacity') || this.getStyle('KhtmlOpacity') || 1);

		return value >= 0.999? 1.0 : 1.0*value;
	},

	clearOpacity: function () {
		var set = { opacity: '1', filter: '' };
		if (JAM.Browser.is('IE')) set.filter = '';
		if (JAM.Browser.is('FF')) set.MozOpacity = 1;
		if (JAM.Browser.is('S'))  set.KhtmlOpacity = 1;
		this.css(set);	
	}

	// <<

});
