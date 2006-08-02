
extend('JAM.Dom.Element', { 

	size: function () { 
		return arguments.length? 
			this.setSize(arguments[0]): 
			this.getSize();
	},

	// >> based on Prototype
	getSize: function(){
		if (this.getCss('display') != 'none') {
			return { w: this.offsetWidth, h: this.offsetHeight };
		}
		else { /* Display temporarily, measure and restore. */
			this.setCss.({ visibility: 'hidden', position: 'absolute', display: '' });
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
