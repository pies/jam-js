
if (!JAM.Lang) JAM.Lang = {};

JAM.Lang.Class = {

	// Returns a function that auto-initializes on creation
	// >> based on Prototype
	create: function(from) {
		var f = function() {
			if (this.initialize)
				this.initialize.apply(this, arguments);
		};
		if (from) {
			extend(f.prototype, from);
		};
		f.prototype['publish'] = function(){
			JAM.Lang.Class.publish(this, $A(arguments).flatten());
		};
		return f;
	},
	// <<

	// Extends and object with another object's properties
	extend: function(getr, setr) {
		var p;
		if (typeof getr == 'string') {
			try {  var g = eval(getr)  } catch(e) {};

			if (g) getr = g; else {
				var pieces = getr.split(/\./);
				var c = 'window'; var elem;
				for (var ii=0;elem=pieces[ii]; ++ii) {
					c += '.' + elem;
					try {  var g = eval(c)  } catch(e) {};
					(g) ? '' : eval(c+' = {}'); 
				};
				getr = eval(getr);
			}
		}

		getr.bound = JAM.Lang.Class.bound;

		for (p in setr) {
			if ((getr[p] || undefined) != setr[p]) {
				getr[p] = setr[p];
			}
		}

		publish(setr);

		return getr;
	},

	publish: function(obj, methods) {
		if (!methods) {
			if (typeof obj != 'object' || !obj.published) return this;
			methods = obj.published;
		}
		for (nn in methods) {
			window[methods[nn]] = obj[methods[nn]];
		}
	},

	bound: function(method) {
		var obj  = this;
		return function() {
			return obj[method].apply(obj, arguments);
		}
	}
};

// >> aliases
var create  = JAM.Lang.Class.create;
var extend  = JAM.Lang.Class.extend;
var publish = JAM.Lang.Class.publish;
// <<

//     <?=insert('type')?>

extend('JAM.Lang.Base', {

	published: ['min', 'max', 'areEqual'],

	min: Math.min,

	max: Math.max,

	equalObjects: function (A,B) {
		var J = JAM.Lang.Base;
		for (n in A) {
			if ((isObject(A[n]) && !J.equalObjects(A[n], B[n])) || (A[n] != B[n])) {
				return false;
			}
		}
		return true;
	},

	areEqual: function (A, B) {
		var T = getType(A);
		if (T != getType(B)) return A == B;

		switch (T) {
			case 'object':
			case 'element': return JAM.Lang.Base.equalObjects(A,B); break;
			case 'array':   return $A(A).isEqualTo($A(B)); break;
			default:        return (A == B); break;
		};

		return false;
	}

});


JAM.Lang.Number = {

	times: function() {
		var callbacks = arguments || [];
		if ((!callbacks.length) || (this < 1)) return this;
	
		for (callback in callbacks) {
			if (isString(callback)) callback = eval(callback);
			for (var i=0; i<this; i++) {
				callback.apply(this, [i]);
			}
		}
		return this;
	},

	round: function(precision) {
		return Math.round(this, precision);
	},

	abs: function() {
		return Math.abs(this);
	},

	or: function(substitute) {
		return this || substitute;
	}

};

// >> extensions
extend(Number.prototype, JAM.Lang.Number);
// <<
