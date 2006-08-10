
extend('JAM.Dom.Element', {
	css: function () {
		return arguments.length? 
			this.setCss(arguments[0]): 
			this.getCss();
	},

	// >> based on Prototype
	getCss: function(){
		/* Opera, static element */
		var THIS = this;
		var OSE = ('Opera'==JAM.Browser.name && 'static'==this.style.position);
		/* Any number of property names */
		var V = $A(arguments).collect(function(prop){
			/* If position is static, those are automatic by definition */
			if (OSE && ['left','top','right','bottom'].has(prop)) return null;

			try { var v = 
				/* Value was explicitly set in CSS */
				this.style[prop] || 
				/* IE */
				(this.currentStyle && this.currentStyle[name.camelize()]) ||
				/* If FF/O */
				document.defaultView.getComputedStyle(THIS,null).getPropertyValue(prop) || 
				/* None found */
				null; } catch (e) { debug(e); var v = ''; };

			var RX = new RegExp('^([0-9]+)px$','i');
			var M;
			if (M = v.match( new RegExp('^([0-9]+)px$','i') )) v = parseInt(M[1]);

			return v=='auto'? null : v;
		}.bind(this));

		return 1==arguments.length? V[0] : V;
	},
	// <<

	setCss: function () {
		/* Accepts either a ('name','value') pair or an {name:'value'} object */
		if ( 2==arguments.length ) {
			var styles = {}; 
			styles[arguments[0]] = arguments[1];
		}
		else {
			var styles = $A(arguments)[0];
		}
		/* We'll save the original values for css.restore() */
		this.undo = this.undo || {};
		/* Any number of property names */
		for (prop in styles) {
			this.undo['css_cache_'+prop] = this.getCss(prop);
			this.style[prop] = styles[prop];
		};
		return this;
	},

	restoreCss: function() {
		$A(arguments).flatten().each(function(name) {
			try{ this.style[name] = this.undo['css_cache_'+name] || ''; } catch(e){}
		}.bind(this));
		return this;
	}

});
