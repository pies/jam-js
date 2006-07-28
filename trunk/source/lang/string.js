
extend('JAM.Lang.string', {

	printf: function() {
		var str = this+'';

		for (var i=0; i<arguments.length; i++) {
			var pos  = str.indexOf('%');
			var type = str[pos+1];
			var arg  = arguments[i];

			if (type == 'n') arg *= 1;

			str = str.substr(0, pos) + arg + str.substr(pos+2);
		}

		return str;
	},

	reverse: function() {
		var out = '';
		for (var i = this.length; i >= 0; --i) out += this.charAt(i);
		return out;
	},

	trim: function() {
		return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
	},

	ucFirst: function() {
		return this? this.substr(0,1).toUpperCase() + this.substr(1): this;
	},

	camelize: function() {
		var parts = this.split('-');
		return parts.shift() + parts.collect(this.ucFirst).join('');
	}

});

// >> extensions
extend(String.prototype, JAM.Lang.string);
// <<
