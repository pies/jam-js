
extend('JAM.Lang.Funct', {

	// Binds an object as context of this function
	// >> from Prototype
	bind: function(obj) {
		var f = this;
		return function() {
			return f.apply(obj, arguments);
		}
	}
  	// <<

});

// >> extensions
extend(Function.prototype, JAM.Lang.Funct);
// <<
