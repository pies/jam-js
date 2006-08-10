
extend('JAM.Dom.Element', { 

	// >> based on Prototype
	getSize: function(){
		if (this.getCss('display') != 'none') {
			return { w: this.getCss('width')||this.offsetWidth, h: this.getCss('height')||this.offsetHeight };
		}
		else { /* Display temporarily, measure and restore. */
			this.setCss({ visibility: 'hidden', position: 'absolute', display: '' });
			var dim = { w: this.clientWidth, h: this.clientHeight };
			this.restoreCss('visibility', 'position', 'display');
			return dim;
		}
	},
	// <<

	setSize: function(dest){
		return this.setCss({ 
			width:  dest.w+'px', 
			height: dest.h+'px' 
		});
	}

});
// <<
