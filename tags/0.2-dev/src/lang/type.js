extend('JAM.Lang.Type', {

	published: ['getType', 'isUndef','isNull','isNumber','isString','isArray','isFunction','isElement','isObject'],

	isUndef: function(K) {
		return typeof K == 'undefined';
	},

	isNull: function(K) {
		return isUndef(K) || K === null;
	},

	isEmpty: function(K) {
		return isNull(K) || (isObject(K) && K == {}) || !K;
	},

	isObject: function(K) {
		return !isNull(K) && (typeof(K) == 'object');
	},

	isNumber: function(K) {
		return typeof(K) === 'number';
	},

	isString: function(K) {
		return typeof(K) === 'string';
	},

	isArray: function(K) {
		return (((typeof(K) == 'object') || (typeof(K) === 'function' && typeof(K.item) === 'function'))
			&& (typeof(K.length) === 'number') 
			&& !K.tagName);
	},

	isFunction: function(K) {
		return (typeof(K) === 'function') && !isArray(K);
	},

	isElement: function(K) {
		return (K === window) || (K === document) || ((typeof(K) === 'object') && (K.tagName));
	},

	getType: function (K) {
		if (K === document)   return 'element';
		var T = typeof(K);
		if (isUndef(K))       return 'undefined';
		if (isNull(K))        return 'null';
		if (isNumber(K))      return 'number';
		if (isString(K))      return 'string';
		if (isArray(K))       return 'array';
		if (isFunction(K))    return 'function';
		if (isElement(K))     return 'element';
		return 'object';
	}

});
