
extend('JAM.Lang.Funct', {

	// Binds an object as context of this function
	// >> from Prototype
	bind: function(obj) {
		var f = this;
		return function() {
			return f.apply(obj, arguments);
		}
	},
  	// <<

	// Binds an object as context of this event handler
	// >> from Prototype
	bindEvent: function(obj) {
  		var f = this;
		return function(event) {
			return f.call(obj, event || window.event);
		}
	}
  	// <<

});

// >> extensions
extend(Function.prototype, JAM.Lang.Funct);
// <<
