/*
 *  JAM: a Javascript extension library for web designers
 *
 *  Copyright (c) 2006 Michal Tatarynowicz <tatarynowicz@gmail.com>
 *  Licenced under the Public Domain licence:
 *    http://creativecommons.org/licenses/publicdomain/
 *
 *  Contains excerpts from other Javascript libraries and sources, including
 *  Prototype, Scriptaculous, Dojo Toolkit, MochiKit, jQuery and Yahoo UI.
 *  Please see licence.txt for details.
 *
 *  $Id$
 */

var JAM = {
	NAME:      "JAM",
	VERSION:   "0.3-dev",
	BUILD:     "Standard",
	REVISION:  "714",

	E_NOTICE:  1,
	E_WARNING: 2,
	E_ERROR:   3,

	INCLUDES:  "WWW/?",
	LOADED:    [],

	provides: function (lib) {
		if (this.LOADED.has(lib)) {
			this.report(this.E_WARNING, 'Library already loaded: '.lib);
		}
		else {
			this.LOADED.push(lib);
		}
	},

	requires:  function(lib) {
		if (this.LOADED.has(lib)) return;
		
		var path = this.INCLUDES+lib.toLowerCase().replace('.', '/');
		debug(path);
		try {
			document.write("<scr"+"ipt type='text/javascript' src='"+path+"'></scr"+"ipt>");
		} catch (e) {
			var script = document.createElement("script");
			script.src = path;
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	}
};

// >> aliases
var provides = function(lib) { JAM.provides(lib) };
var requires = function(lib) { JAM.requires(lib) };
// <<


// lang/base.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


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

//     // lang/type.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

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
		var T = typeof(K);
		return (((T == 'object') || (T === 'function' && typeof(K.item) === 'function'))
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




extend('JAM.Lang.Base', {

	published: ['min', 'max', 'areEqual'],

	min: function(A,B) {
		return A<B? A: B;
	},

	max: function(A,B) {
		return A>B? A: B;
	},

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



// lang/funct.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


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



// lang/array.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


extend('JAM.Lang.Array', {

	// EMPTIES
	empty: function(){
		while (this.length) this.shift();
		return this;
	},

	// ITERATES over each element with a CALLBACK (F)unction
	each: function(F) {
		for (var i = 0; i < this.length; ++i) {
			F.apply(this[i], [this[i], i]);
		}
		return this;
	},

	// ITERATES over each element with a CALLBACK (F)unction COLLECTING return VALUES
	collect: function(F) {
	    var R = [];
	    this.each(function(I,N) {
			R.push( F.apply(I, [I,N]) );
	    });
	    return R;
	},

	// Returns an array of values where F(value) == true
	// >> from Prototype
	filter: function(F) {
		var R = [];
		this.each(function(I,N){
			if (F.apply(I, [I,N])) R.push(I);
		});
		return R;
	},
	// <<

	add: function(A) {
		this.push(A);
		return this;
	},

	only: function(AA) {
		AA = $A(AA);
		return this.filter(function(N){
			return AA.has(N);
		});
	},

	not: function(AA) {
		AA = $A(AA);
		return this.filter(function(N){
			return AA.hasnt(N);
		});
	},

	// Returns the last element for which F(elem,best) was true
	// Used by min() and max().
	choose: function(F) {
		var best = this.shift();
		this.each(function(elem){
			if (F(elem,best)) best = elem;
		});
		return best;
	},

	min: function () {
		return this.choose(Math.min);
	},

	max: function () {
		return this.choose(Math.max);
	},

	// Returns an array of elements that are also in the specified range
	limitTo: function(range) {
		return this.filter(range.has);
	},

	// Returns an array containing values from properties specified by P
	// >> from Prototype
	pluck: function(K) {
		return this.collect(function() {
			return this[K] || undefined;
		});
	},
	// <<

	// Return an array of NON-EMPTY values
	// >> from Prototype
	compact: function() {
		var R = [];
		this.each(function(F){
			if (!isNull(F) && F) R.push(F);
		});
		return extend(R, JAM.Lang.Array);
	},
	// <<

	// Converts a multi-dimensional array into a flat list.
	// >> from Prototype
	flatten: function() {
		var R = [];
		this.each(function(item){
			R = R.concat(isArray(item)? $A(item).flatten() : [item]);
		});
		return R;
	},
	// <<

	// Converts an ITERABLE object TO an ARRAY
	// >> from Prototype
	from: function(obj) {
		if (!obj)          return [];
		if (!obj.length)   return [obj];
		if (isString(obj)) return [obj];
		if (obj.toArray)   return obj.toArray();

		var O = [];
		for (var i=0; i < obj.length; i++) {
			O.push(obj[i]);
		}
		return O;
	},
	// <<

	has: function(I) {
		for (var F in this){
			if (this[F] == I) return true;
		}
		return false;
	},

	hasnt: function(I) {
		return !($A(this).has(I));
	},

	unique: function() {
		var result = [];
		this.each(function(elem){
			if (!(result.has(elem))) result.push(elem);
		});
		return result;
	},

	skip: function(N) {
		for ( i=0 ; i<(N||1) ; ++i ) {
			this.shift;
		}
	},

	isEqualTo: function(A) {
		this.each(function(I,N){
			if ((I && I.isEqualTo && !I.isEqualTo(A[N])) || I != A[N]) return false;
		});
		return true;
	}

});


// >> extensions
extend(Array.prototype, JAM.Lang.Array);
// <<

// >> aliases
var $A = JAM.Lang.Array.from;
// <<



// ready.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

/*
 * Responsible for starting up scripts that use the DOM, 
 * but want to be started as soon as possible (i.e. before 
 * the page is displayed)
 */

extend(JAM, {

	startupTasks: {},
	readyTimer: null,
	
	onReady: function (handler, context) {
		if (!JAM.startupTasks.ready) {
			JAM.prepareReadyEvent();
			JAM.startupTasks.ready = [];
		}
		JAM.startupTasks.ready.push(function(){ 
			return handler.apply(context||document); 
		});
	},

	onLoad: function (handler, context) {
		if (!JAM.startupTasks.load) {
			JAM.prepareLoadEvent();
			JAM.startupTasks.load = [];
		}
		JAM.startupTasks.load.push(function(){ 
			return handler.apply(context||document); 
		});
	},

	prepareLoadEvent: function() {
		connect(window, 'load', function(){ 
			JAM.performStartup('ready');
			JAM.performStartup('load');
		});
	},

	prepareReadyEvent: function() {
		var R = function(){ 
			JAM.performStartup('ready');
		}.bind(JAM);

		/* for Mozilla */
		connect(document, 'DOMContentLoaded', R);

		/* for IE */
		/*@cc_on @*/
		/*@if (@_win32)
		document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
		document.getElementById('#__ie_onload').onreadystatechange = function() {
			if (this.readyState == "complete") R(); 
		};
		/*@end @*/

		/* for Safari */
		if (/WebKit/i.test(navigator.userAgent)) { 
			JAM.readyTimer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) R(); 
			}, 10);
		}

		JAM.prepareLoadEvent();
	},

	performStartup: function(name) {
		if (JAM.readyTimer) clearInterval(JAM.readyTimer);
		if (!JAM.startupTasks[name]) return true;

		var handler = JAM.startupTasks[name].shift();
		while (handler) {
			handler();
			handler = JAM.startupTasks[name].shift();
		};

		return true;
	}
});



// lang/events.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


// Events
// Modified version of MochiKit's Signal classes
// >> from MochiKit

extend('JAM.Lang.Events', {

	specialKeys: {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	},

	_observers: [],

    _unloadCache: function () {
    	var E = JAM.Lang.Events;
    	$A(E._observers).each(E._disconnect);
        delete self._observers;
        try { window.onload = undefined; }   catch(E){};
        try { window.onunload = undefined; } catch(E){};
    },

    _listener: function (obj, func, context) {
		return function(event){ 
			var E = new JAM.Lang.Event(obj, event);
			(isString(func)? obj[func]: func).apply(context||obj, [E]); 
		}
    },

	_connect: function(obj, name, listener) {
		if (obj.addEventListener) {
			obj.addEventListener(name, listener, false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent('on'+name, listener); // useCapture unsupported
		}

		var ID = [obj, name, listener];
		JAM.Lang.Events._observers.push(ID);
		return ID;
	},

	_mousePosition: [0,0],
	_mouseButtons:  [],

	_initMouseTracker: function(){
		connect(window, ['mouseup', 'mousedown'], this._trackMouseButtons.bind(this));
		connect(document, ['mousemove'], this._trackMousePosition.bind(this));
	},

	_trackMousePosition: function(event){
		var E = event.event;
		this._mousePosition = {
			x: E.clientX, 
			y: E.clientY,
			px: E.pageX,
			py: E.pageY
		};

		//var P = this._mousePosition;
		//debug('saving mouse position', P.x,P.y,P.px,P.py);
	},

	_trackMouseButtons: function(event){
		var E = event.event;
		var DOWN = ('mousedown' == (E.type||''));
		var P = this._mouseButtons || [];
		var B = E.which? 
			(1 == E.which? 'L': (2 == E.which? 'M': (3 == E.which? 'R': false))):
			(1 & E.button? 'L': (4 & E.button? 'M': (2 & E.button? 'R': false)));

		this._mouseButtons = DOWN? P.add(B): P.not(B);
	},

	connect: function (obj, name, context, func) {
		if (window.$) obj = $(obj);
		if (!obj) return obj;

		var onlyOne = (JAM.Lang.Type && JAM.Lang.Type.isString(name));

		var names = onlyOne? [name]: name;

		if (isFunction(context)) {
			var func = context; 
			var context = obj;
		};

		var listener = JAM.Lang.Events._listener(obj, func, context);

		var ids = names.collect(function(name){
			return JAM.Lang.Events._connect(obj, name, listener);
		});

		return onlyOne? ids.shift(): ids;
	},

	_disconnect: function (event_id) {
		var obj      = event_id[0];
		var name     = event_id[1];
		var listener = event_id[2];

		if (obj.removeEventListener) {
			obj.removeEventListener(name, listener, false);
		}
		else if (obj.detachEvent) {
			obj.detachEvent('on'+name, listener);
		}
	},

    disconnect: function () {
		$A(arguments).each(function(id){
			JAM.Lang.Events._observers.each(function(obs,index){
				if ((obs[0] == id[0]) && (obs[1] == id[1]) && (obs[2] == id[2])) {
					JAM.Lang.Events._disconnect(obs);
					JAM.Lang.Events._observers.splice(index,1);
					return true;
				}
			});
		});

		return false;
    },

    disconnectAll: function() {
        var signals = arguments;
        var disconnect = JAM.Lang.Events._disconnect;
        var observers  = JAM.Lang.Events._observers;

        if (signals.length == 0) {
            // disconnect all
            var ident;
			for (var i = observers.length - 1; ident=observers[i]; i--) {
				disconnect(ident);
				observers.splice(i, 1);
			}
        } 
		else {
	    	var src = $(signals.shift());
            var sigs = {};
            for (var i = 0; i < signals.length; i++) {
                sigs[signals[i]] = true;
            }
            for (var i = observers.length - 1; i >= 0; i--) {
                var ident = observers[i];
                if (ident[0] === src && ident[1] in sigs) {
                    disconnect(ident);
                    observers.splice(i, 1);
                }
            }
        }

    },

    trigger: function (elem, type, data) {
		var obs;
		JAM.Lang.Events._observers.each(function(obs){
			if ((obs[0]==elem) && (obs[1]==type)) {
				obs[2].apply(elem, [new JAM.Lang.Event]);
			}
		});
    }

});
// <<

// >> aliases
var connect    = JAM.Lang.Events.connect;
var disconnect = JAM.Lang.Events.disconnect;
var trigger    = JAM.Lang.Events.trigger;
// <<



JAM.Lang.Event = function(src, event){

	this.event = event || window.event;

	if (this.event) {
		var T = this.event.target || this.event.srcElement;
		this.src    = src || this.event.srcElement || T;
		this.type   = this.event.type || undefined;
		this.target = (JAM.Dom && JAM.Dom.selector)? JAM.Dom.selector.get(T): T;
		this.mouse.buttons = JAM.Lang.Events._mouseButtons;
	}

};



JAM.Lang.Event.prototype = {

    modifier: function () { 
		var E = this.event;
		if (!E) return;

    	return {
    		alt:   E.altKey,
        	ctrl:  E.ctrlKey,
        	meta:  E.metaKey || false, // IE and Opera punt here
        	shift: E.shiftKey
    	};
    },

    key: function () {
		if (!this.event) return;

		if (this.type.match(/key(down|up)/)) {
            return this.event.keyCode;
        }
        else if (this.type.indexOf('key') !== 0) {
			var K = this.event.keyCode;
			var C = this.event.charCode;
			var D = !(typeof(C) == 'undefined');
			return ( D && C? C : ( K && !D ? K : 0 ));
        }
        else {
        	return undefined;
        }
    },
 	
	// >> from Mochikit & Prototype
	mouse: function () { 
		if (!this.event) return;

		var E = this.event;
		var B  = document.documentElement || document.body;

//		debug(this.type);
		if (this.type && this.type.match(/mousemove|click|contextmenu/)) {
//			debug (this.type);
			JAM.Lang.Events._trackMousePosition(this);
		}

		var M = JAM.Lang.Events._mousePosition;

		return /*(this.type && this.type.match(/mouse|click|contextmenu/))?*/ {
	        x:       max( 0, M.x ),
	        y:       max( 0, M.y ),
	        page_x:  max( 0, M.px || (M.x + B.scrollLeft - B.clientLeft) ),
	        page_y:  max( 0, M.py || (M.y + B.scrollTop  - B.clientTop) ),
	        buttons: JAM.Lang.Events._mouseButtons
    	}/*:undefined*/;
    },
	// <<

    stop: function () {
        this.stopPropagation();
        this.preventDefault();
    },

    stopPropagation: function () { var E = this.event;
        (E.stopPropagation && E.stopPropagation()) || (E.cancelBubble = true);
    },

    preventDefault: function () { var E = this.event;
        (E.preventDefault && E.preventDefault()) || (E.returnValue = false);
    }
};


JAM.onLoad(JAM.Lang.Events._initMouseTracker.bind(JAM.Lang.Events));



// browser.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


JAM.Browser = {

	os:      null,
	name:    null,
	version: null,

	guess: function(){
		var has = function(str) { return navigator.userAgent.indexOf(str) >= 0 };

		if (has("Macintosh")) { this.os = 'Mac';     } else 
		if (has("Windows"))   { this.os = 'Windows'; } else 
		if (has("X11"))       { this.os = 'Linux';   } else 
		                      { this.os = 'unknown'; };

		if (has("Opera"))     { this.name = 'Opera';   } else 
		if (has("Konqueror")) { this.name = 'KHTML';   } else 
		if (has("Safari"))    { this.name = 'Safari';  } else 
		if (has("Gecko"))     { this.name = 'Mozilla'; } else 
		if (document.all)     { this.name = 'IE';      } else 
		                      { this.name = 'unknown'; };

		this.version = parseFloat(navigator.appVersion);
	},

	is: function(name, version) {
		if (!this.name) JAM.Browser.guess.apply(JAM.Browser);

		if (name == 'FF' || name == 'Firefox') name = 'Mozilla';
		if (name == 'O') name = 'Opera';
		if (name == 'S') name = 'Safari';

		return (this.name == name) && (!version || (this.version == parseFloat(version)));
	}

};



// compat.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


var DOC = {};

JAM.Compat = {

	init: function(){
		DOC.Body = document.documentElement || document.body;
	}

};

JAM.onReady(JAM.Compat.init);



// lang/debug.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


if (JAM.Browser.is('Opera')) {
	// Opera's debugging API
	var debug = window.opera.postError;
	var trace = window.opera.postError;
}
else if (JAM.Browser.is('FF') && window.console) {
	// Firefox's Firebug
	var debug = window.console.debug;
	var trace = window.console.trace;
}
else if (JAM.Browser.is('IE')) {
	// IE also has error reporting (if a bit strange)
	var reportStatus = [];
	function report ( msg ) {
		reportStatus.push ( msg );
	}
	function showReport ( err ) {
	    alert ( reportStatus.join ( "\n" ) );
	}
	window.onerror = function ( err, url, line ) {
		report ( err + " [" + url + " - line " + line + "]" );
	    showReport();
	}
}
else {
	// We really should downgrade to something better than alert()
	var debug = alert;
	var trace = alert;
}




JAM.Compat.init();

// lang/string.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


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



// dom/array.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

extend('JAM.Dom.array', {

	add: function() {
		return extend(
			this.concat($$.apply(window, arguments))
		, JAM.Dom.array);
	},

	only: function(pattern) {
		var filtered = $$F.apply(window, [this, pattern]);
		return extend(
			this.filter(filtered.has.bind(filtered))
		, JAM.Dom.array);
	},

	not: function(pattern) {
		var filtered = $$F.apply(window, [this, pattern]);
		return extend(
			this.filter(filtered.hasnt.bind(filtered))
		, JAM.Dom.array);
	},

	show: function(){
		return this.each(function(elem){ elem.show(); });
	},

	hide: function(){
		return this.each(function(elem){ elem.hide(); });
	},

	css: function(){
		var args = arguments;
		return this.each(function(elem){ elem.css.apply(elem, args); });
	},

	opacity: function(value){
		return this.each(function(elem){ elem.opacity(value); });
	},
	
	addClass: function(value) {
		return this.each(function(elem){ elem.addClass(value); });
	},

	removeClass: function(value) {
		return this.each(function(elem){ elem.removeClass(value); });
	},

	on: function(type, callback){
		$$F(this).each(function(elem){ elem.on(type, callback); });
		return this;
	},

	go: function(type){
		return this.each(function(elem){ elem.go(type); });
	},

	set: function(){
		var args = arguments;
		return this.each(function(elem){ elem.set.apply( elem, args ) });
	},

	placeOver: function(rel){
		return this.each(function(elem){ elem.placeOver(rel); });
	}

});

// >> extensions
//extend(Array.prototype, JAM.Dom.array);
// <<



// lang/shape.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


provides('Shape');

JAM.Shape = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};
	
extend( JAM.Shape.prototype, {

	contains: function(A) { 
//		debug(A.x,A.y);
		return !(
			A.x < this.x || 
			A.y < this.y || 
			A.x + (A.w || 0) > this.x + this.w || 
			A.y + (A.h || 0) > this.y + this.h
		);
	}

});



// dom/element.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


provides('Dom.Element');
requires('Lang.Shape');

extend('JAM.Dom.Element', {

	/* DOM manipulation
	-------------------------------------------------------------- */

	name: function() {
		return (this.tagName||'element').toLowerCase();
	},

	set: function() {
		var data = {};

		if ( isArray(arguments[0]) ) {
			data = $A(arguments).flatten();
		}
		else if ( 1 == arguments.length ) {
			var main_prop = 'input'==this.name()? 'value': 'innerHTML';
			data[main_prop] = arguments[0];
		}
		else {
			data[arguments[0]] = arguments[1];
		}

		for (prop in data) this[prop] = data[prop];

		return this;
	},

	get: function() {
		if (!arguments.length) {
			var main_prop = 'input'==this.name()? 'value': 'innerHTML';
			return this[main_prop];
		}
		else {
			return $A(arguments).flatten().collect(function(prop){
				return this[prop];
			}.bind(this));
		}
	},





	append: function() {
		var self = this;
		$A(arguments).each(function(item){
			self.appendChild( isString(item)? document.createTextNode(item): item );
		});
		return this;
	},

	replace: function (elem1,elem2) {
		this.replaceChild(elem2,elem1);
		return this;
	},

	replaceWith: function (elem) {
		this.parentNode.replaceChild(elem, this);
		return this;
	},

	remove: function () {
		if (arguments.length) {
			arguments.each(function(elem){ this.removeChild(elem) }.bind(this));
			return this;
		} else {
			this.parentNode.removeChild(this);
			return null;
		}
	},

	putInto: function (elem) {
		elem.appendChild(this);
		return this;
	},





	hasClass: function(N){
		return (this.className || '').match(new RegExp("(\\b)"+N+"(\\b)"));
	},

	// IDEA: Is it faster to check first, or should we write directly to the property?
	addClass: function(N){
		if (!this.hasClass(N)) this.className = (this.className+' '+N).trim();
		return this;
	},

	// IDEA: Is it faster to check first, or should we write directly to the property?
	removeClass: function(N){
		if (this.hasClass(N)) this.className = this.className.replace(new RegExp("\\b"+N+"\\b",'g'), '').trim();
		return this;
	},

	toggleClass: function(N) {
		if (this.hasClass(N)) this.removeClass(N); else this.addClass(N);
	},






	show: function() {
		this.style.display = this._display || '';
		return this;
	},

	hide: function() {
		if (this.style.display != 'none') {
			this._display = this.style.display;
			this.style.display = 'none';
		}
		return this;
	},





	ancestor: function(filter) {
		if (!this.parentNode) return false; 
		if (!filter) return this.parentNode; 

		var elem = this;
		while (elem.parentNode) {
			if (filter(elem.parentNode)) return elem.parentNode; 
			elem = elem.parentNode;
		}
		return false;
	},

	isAncestorOf: function(child) {
		return child.ancestor(function(elem){
			return this == elem;
		}.bind(this));
	},




	// >> from Prototype
	prepareDelta: function() {
		this.delta = {
			x: window.pageXOffset || DOC.Body.scrollLeft || 0,
			y: window.pageYOffset || DOC.Body.scrollTop  || 0
		};
	},

	getCumulativePosition: function(){
		var P = { x:0,y:0 };
		var elem = this;
		do { 
			P.x += elem.offsetLeft || 0;
			P.y += elem.offsetTop  || 0;
			elem  = elem.offsetParent;
		} while (elem);
		return P;
	},
	// <<

	getArea: function() {
		var P = this.getPosition();
		var S = this.getSize();
		return new JAM.Shape( P.x, P.y, S.w, S.h );
	},

	getPosition: function() {
		return this.getCumulativePosition();
	},

	setPosition: function(pos) {
		this.makePositioned();
		this.setCss('left',(pos.x || 0)+'px');
		this.setCss('top', (pos.y || 0)+'px');
		return this;
	},

	position: function(pos) {
		if (pos) {
			return this.setPosition(pos);
		}
		else {
			return this.getPosition();
		}
	},

	makePositioned: function() {
		var pos = this.getCss('position');
		if (pos == 'static' || !pos) {
			this.setCss({ position: 'absolute' });
			// Opera returns the offset relative to the positioning context, when an
			// element is position relative but top and left have not been defined
			if (window.opera) {
				this.setCss({ top:0, left:0 });
			}  
		}
		return this;
	},

	fitInside: function(element, margin) {
		if (isUndef(margin)) margin = [10,10,10,10];
		if (!isArray(margin)) margin = [margin,margin,margin,margin];

		var s = element.getSize();
		var p = element.getPosition();
		this.setSize({ w: s.w-(margin[1]+margin[2]+4), h: s.h-(margin[0]+margin[3]+4) });
		this.setPosition({ x: p.x+margin[2], y: p.y+margin[0]});
	},

	placeOver: function(elem, delta) {
		delta = delta || { x:0,y:0 };
		var pos = elem.getPosition();
		var size = elem.getSize();
		var mysize = this.getSize();
		var ppos = $(this.parentNode).getPosition();
		this.setPosition({
			x: Math.round(pos.x+(size.w/2)-ppos.x-(mysize.w/2)),
			y: Math.round(pos.y+(size.h/2)-ppos.y-(mysize.h/2))
		});
		return this;
	},

	limitPositionToWindow: function(new_pos) {
		var s = this.getSize();
		var p = new_pos || this.getPosition();
		var w = windowSize();
		var o = scrollOffset();

		if (p.x + s.w > w.w) p.x = o.x + w.w - s.w;
		if (p.y + s.h > w.h) p.y = o.y + w.h - s.h - 4;
		

		this.position({ x: max(0, p.x), y: max(4, p.y) });
	}

});


// >> // dom/element/size.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


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



// >> // dom/element/css.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


extend('JAM.Dom.Element', {
	css: function () {
		return arguments.length? 
			this.setCss(arguments[0]): 
			this.getCss();
	},

	// >> based on Prototype
	getCss: function(){
		/* Opera, static element */
		var OSE = ('Opera'==JAM.Browser.name && 'static'==this.style.position);
		/* Any number of property names */
		var V = $A(arguments).collect(function(prop){
			/* If position is static, those are automatic by definition */
			if (OSE && ['left','top','right','bottom'].has(prop)) return null;

			try { var v = 
				/* Value was explicitly set in CSS */
				this.style[prop] || 
				/* IE */
				this.currentStyle[name.camelize()] ||
				/* If FF/O */
				document.defaultView.getComputerStyle(T,null).getPropertyValue(prop) || 
				/* None found */
				null; } catch (e) { var v = null; };

			return v=='auto'? null : v;
		});

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



// >> // dom/element/opacity.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


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



// >> // dom/element/events.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


extend('JAM.Dom.Element', {

	on: function(name, callback, id) {
		if (!this.connections) this.connections = [];
		this.connections.push(connect(this, name, callback));
		return this;
	},

	off: function(n) {
		n = n || (this.connections? this.connections.length: 0);
		for (var i=0; i<n; ++i) {
			var id = this.connections.shift();
			disconnect(this, id);
		}
		return this;
	},

	go: function(name) {
		trigger(this, name);
		return this;
	}

});
 




function windowSize () {
	return {
		w: window.innerWidth  || DOC.Body.clientWidth,
		h: window.innerHeight || DOC.Body.clientHeight
	}
}

function scrollOffset (pos) {
	if (pos) {
		if (window.pageXOffset) {
			window.pageXOffset = pos.x;
			window.pageYOffset = pos.y;
		}
		else {
			DOC.Body.scrollLeft = pos.x;
			DOC.Body.scrollTop = pos.y;
		}
	}
	else return {
		x: window.pageXOffset || DOC.Body.scrollLeft || 0,
		y: window.pageYOffset || DOC.Body.scrollTop  || 0
	}
}



// dom/selector.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

if (!JAM.Dom) JAM.Dom = {};

JAM.Dom.selector = {

	// Returns a SINGLE ELEMENT
	get: function(D, C) {

		if (isNull(D)) {
			return D;
		}
		else if (isElement(D)) {
			return extend(D, JAM.Dom.Element);
		}

		var nodes = $$(D, C);
		return nodes.length? nodes[0]: null;
	},

	// Returns an ARRAY OF ELEMENTS
	getMany: function(Descr, Contexts, limit_to) {

		var O = extend([], JAM.Dom.array);

		switch (getType(Descr)) {
			case 'string':  Descr = Descr.split(' ') || '*'; break;
			case 'element': O.push(Descr); return O;
			case 'null': 
			case 'undefined': return O;
		}

		switch (getType(Contexts)) {
			case 'string':  Contexts = this.getMany(Contexts); break;
			case 'element': Contexts = [Contexts]; break;
			case 'array':   break;
			default:        Contexts = [document];
		}

		Descr    = $A(Descr).compact();
		Contexts = $A(Contexts).compact().unique();

		var D = Descr.shift();

		Contexts.each(function(context){

			if (isUndef(D)) {
				var T = [];
			}
			else if (isElement(D)) {
				var T = [D];
			}
			else if (D.indexOf('#') == 0) {
				var T = [context.getElementById(D.substr(1,D.length))];
			}
			else if (D.indexOf('.') == 0) {
				var T = JAM.Dom.selector.withClass(D.substr(1,D.length), context);
			}
			else {
				var N = null;
				if (D.indexOf('.') > 0) {
					var N = D.substr(D.indexOf('.')+1,D.length);
					D = D.replace('.'+N, '');
				}

				var T = $A(context.getElementsByTagName(D));

				// IF NO TAGS WITH THAT NAME, TRY '#'+NAME (FOR PROTOTYPE COMPATIBILITY)
				if (!T.length) {
					var E = $$('#'+D).shift();
					if (E) T = [E];
				}
				else if (N) {
					T = T.collect(function(E){
						if (E.className && JAM.Dom.selector.hasClass(E, N)) return E;
					});
				}
			}

			T = T.compact().unique();
			T = Descr.length? JAM.Dom.selector.getMany(Descr, T): T;

			O = O.concat(T);
		});
		
		$A(O).each(function(elem){ 
			if (!elem._extended) {
				extend(elem, JAM.Dom.Element);
				elem._extended = true;
			}
		});

		return extend(O, JAM.Dom.array);
	},

	filter: function (elements, descr) {
		var passing = $$(descr||'*');
		return elements.filter(function(elem){
			return passing.has(elem, descr);
		});
	},

	passes: function (elem, descr) {
		return $$(descr, elem.parentNode).has(elem);
	},

	hasClass: function(E, N){
		return (E.className || '').match(new RegExp("(\\b)"+N+"(\\b)"));
	},

	// Finds all elements with specified content
	// >> from Prototype
	withClass: function(Name, Context) {
		var children = [].from(  (this.get(Context) || document.body).getElementsByTagName('*')  ) || [];
		var elements = [];
		var self = this;
		return children.collect(function(child){
			if (self.hasClass(child, Name)) return child;
		});
	}
	// <<
};




// >> aliases
var $   = JAM.Dom.selector.get;
var $$  = JAM.Dom.selector.getMany;
var $$F = JAM.Dom.selector.filter;
// <<

// dom/creator.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

if (!JAM.Dom) JAM.Dom = {};

JAM.Dom.creator = {

	tags: ['A', 'BR', 'BUTTON', 'CANVAS', 'DIV', 'FIELDSET', 'FORM',
	 'H1', 'H2', 'H3', 'HR', 'IMG', 'INPUT', 'LABEL', 'LEGEND',
	 'LI', 'OL', 'OPTGROUP', 'OPTION', 'P', 'PRE', 'SELECT',
	 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TEXTAREA',
	 'TFOOT', 'TH', 'THEAD', 'TR', 'TT', 'UL', 'IFRAME' ],

	initialize: function(){
		window.HTML = {};
		this.tags.each(this.define);
	},

	define: function (N) {
		window.HTML[N.toUpperCase()] = function() {
			return JAM.Dom.creator.createNode(N, arguments);
		};
	},

	createNode: function(N, Args) {
		N = document.createElement(N);

		// IE that doesn't use Element.prototype
		// was: if (document.all) { extend(N, JAM.Dom.Element) };
		extend(N, JAM.Dom.Element);

		// Apply parameters (including CSS)
		Args = $A(Args);
		if (Args.length && !isElement(Args[0])) {
			if (Args[0].css) {
				var CSS = Args[0].css;
				Args[0].css = undefined;
				for(S in CSS){
					N.style[S] = CSS[S];
				}
			}
			extend(N, Args.shift() || {});
		}

		// Append child elements
		Args.flatten().compact().each(function(A){
			if (isString(A) || isNumber(A)) A = document.createTextNode(''+A);
			N.appendChild(A);
		});

		return N;
	}

};

JAM.Dom.creator.initialize();



// dom/dynamic/draggable.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


provides('Dom.Draggable');
requires('Dom.Element');

extend('JAM.Dom.Draggable', {

	element:      false,
	handle:       false,
	offset:       { x:0, y:0 },
	prev:         { x:0, y:0 },
	eventHandler: null,
	

	init: function() {
//		$$('.Draggable').add('.DragHandle')
//			.on('mousedown', this.pickUp.bind(this));
		connect(document, 'mouseup', this.putDown.bind(this));
	},

	apply: function (element, options) {
		$$(element)
			.addClass('Draggable')
			.add('.DragHandle', element)
				.on('mousedown', this.pickUp.bind(this));
	},

	findMovable: function(clicked) {
		if (clicked.hasClass('Draggable'))  return clicked;
		if (clicked.hasClass('DragHandle')) return clicked.ancestor(function(elem){ return elem.hasClass('Draggable') });
		return false;
	},

	pickUp: function(event) {
		this.element = $(this.findMovable(event.target));
		if (!this.element) return false;

		this.element.makePositioned().addClass('Dragged');

		var pos   = this.element.position();
		var mouse = event.mouse();

		this.prev = { x: mouse.x, y: mouse.y };
		this.offset = { 
			x: mouse.x - pos.x,
			y: mouse.y - pos.y
		};

		this.eventHandler = this.eventHandler || connect(document, 'mousemove', this.updatePosition.bind(this));

		this.timer = new Date();
	},


	updatePosition: function(event) {
		if (!this.element) return;

		var mouse = event.mouse();

		/* Firefox fires multiple events for the same position */
		var n = { x: mouse.x, y: mouse.y };
		if (this.prev == n) return;
		this.prev = n;

//		var V = { x: prev.x - mouse.x, y: prev.y - mouse.y };
//		var Vmax = Math.max( V.x.abs(), V.y.abs(), 1 );
//		this.vector = { x: V.x / Vmax, y: V.y / Vmax };
//		var d = new Date();
//		this.took = this.timer - d;
//		this.timer = d;

		this.element.position({
			x: mouse.x - this.offset.x,
			y: mouse.y - this.offset.y
		});
	
		// this.element.limitPositionToWindow({ x: mouse.x - this.offset.x, y: mouse.y - this.offset.y });

		if (this.element.style.visibility=="hidden") this.element.style.visibility = ""; /* fix Gecko rendering */
		if (JAM.Browser.is('Safari')) window.scrollBy (0,0);   /* fix AppleWebKit rendering */
		event.stop(); /* IE fix not to select contents on drag */
	},


	putDown: function(event) {
		if (!this.element) return;

//		DOC.Body.uncss('overflow');

//		var dist   = Math.sqrt(Math.abs(this.vector.x), Math.abs(this.vector.y));
//		var speed  = Math.abs((1000*dist) / (this.timer - new Date()));
//		var P = this.element.getPosition();
//		this.FX = new FX(this.element);
//		this.FX.glide(.2, P, { x:this.vector.x * speed, y:this.vector.y * speed });

		this.element.removeClass('Dragged');
		disconnect(this.eventHandler);
		this.eventHandler = null;
		this.element = false;


		DOC.Body.focus();
	}

});

var FX = create({

	initialize: function(elem){
		this.elem = elem;
	},

	_cos: function(pos){
		return 1.0*((-Math.cos(pos*Math.PI)/2) + 0.5);
	},
	
	glide: function(length, start, vector) {
		this.START = start;
		this.V = vector;
		this.FX = this._cos;

		this.APPLY = function(){
			var M = -1 * this.FX(this.STEP/this.TOTAL);
			this.elem.setPosition({ 
				x: Math.round(this.START.x + (M * this.V.x)),
				y: Math.round(this.START.y + (M * this.V.y))
		})}.bind(this);

		this.GO(length);
	},

	GO: function(speed){
		this.STEP = 2;
		this.TOTAL = ((speed*1000) / 30).round() + 2;
		this.TIMER = setInterval(this.LOOP.bind(this), 30);
	},

	LOOP: function(){
		this.STEP++;
		if (this.STEP > this.TOTAL) return clearInterval(this.TIMER);
		this.APPLY();
	}
});

extend('JAM.Dom.Element', {
	makeDraggable: function() {
		JAM.Dom.Draggable.apply(this);
		return this;
	}
});

JAM.onLoad(JAM.Dom.Draggable.bound('init'));



// dom/dynamic/resizable.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


provides('Dom.Resizable');
requires('Dom.Element');

extend('JAM.Dom.Resizable', {

	element:       false,
	content:       false,
	offset:        { x:0, y:0 },
	contentOffset: { x:0, y:0 },
	previous:      { x:0, y:0 },
	eventHandler:  null,
	
	init: function() {
		connect(document, 'mouseup',   this.putDown.bind(this));
	},

	apply: function(elements, params) {
		var self = this;
		
		var params = extend({ content: false }, params);
		$A(elements).each(function(elem){
			$$('.ResizeHandle', elem).on('mousedown', self.pickUp.bind(self));
			elem.params = extend(elem.params || {}, params);
		});
	},

	pickUp: function(event) {
		this.element = event.target.parentNode
			.makePositioned()
			.addClass('Resized');

		var size = this.element.size();
		var mouse = event.mouse();
		this.offset = {
			w: mouse.x - size.w,
			h: mouse.y - size.h
		};

		this.content = (this.element.params && this.element.params.content) || false;
		if (this.content) {
			var content_size = this.content.size();
			this.contentOffset = {
				w: size.w - content_size.w,
				h: size.h - content_size.h
			}
		}

		if (!this.eventHandler) {
			this.eventHandler = connect(document, 'mousemove', this.update.bind(this));
		}	

		//event.stop(); // IE fix not to select contents on drag*/
	},

	update: function(event) {

		if (!this.element) return;
		if (this.skipUpdate) return;

		var mouse = event.mouse();
		if (!mouse.buttons.has('L')) return this.putDown(event);

		var current = { x: mouse.x, y: mouse.y };
		if (current == this.previous) return; // FF fires multiple events for the same position
		this.previous = current;

		var newSize = {
			w: mouse.x - this.offset.w,
			h: mouse.y - this.offset.h
		};
		this.element.setSize(newSize);

		this.content = this.element.params && this.element.params.content || false;
		if (this.content) {
			this.content.setSize({
				w: newSize.w - this.contentOffset.w,
				h: newSize.h - this.contentOffset.h
			});
		}

		if (JAM.Browser.is('IE') || JAM.Browser.is('Opera')) {
			this.skipUpdate = true;
			setTimeout(function(){this.skipUpdate=false}.bind(this), 50);
		}

		//event.stop(); // IE fix not to select contents on drag*/
	},

	putDown: function(event) {
		if (!this.element) return;
	
		this.element.removeClass('Resized');
		this.element = false;
		this.content = false;

		disconnect(this.eventHandler);
		this.eventHandler = null;
	}
});

extend('JAM.Dom.Element', {
	makeResizable: function() {
		JAM.Dom.Resizable.apply(this);
		return this;
	}
});

JAM.onLoad(JAM.Dom.Resizable.bound('init'));



// io/ajax.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

// >> based on Moo.fx' version (which in turn is based on Prototype)
JAM.Ajax = create({

	initialize: function (url, params) {
		this.post       = params.post       || '';
		this.onComplete = params.onComplete || null;
		this.update     = $(params.update)  || null;
		this.method     = params.post? 'post': 'get';
		this.transport  = this.getTransport();
		this.request(url);
	},

	getTransport: function() {
		if (window.ActiveXObject)  return new ActiveXObject('Microsoft.XMLHTTP');
		if (window.XMLHttpRequest) return new XMLHttpRequest();
		return false;
	},
	
	request: function(url) {
		this.transport.open(this.method, url, true);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if (this.method == 'post') {
			this.transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			if (this.transport.overrideMimeType) this.transport.setRequestHeader('Connection', 'close');
		}
		this.transport.send(this.post);
	},

	onStateChange: function() {
		if (this.transport.readyState == 4 && this.transport.status == 200) {
			if (this.onComplete) 
				setTimeout(function(){ this.onComplete(this.transport) }.bind(this), 10);
			if (this.update)
				setTimeout(function(){ this.update.html(this.transport.responseText) }.bind(this), 10);
			this.transport.onreadystatechange = function(){};
		}
	}

});
// <<


// >> idea taken from jQuery
extend('JAM.Dom.Element', {
	load: function (url,params) {
		params.update = this;
		this._loader = new JAM.Ajax(url,params);
		return this;
	}
});
// <<



/*
 * need to decide when to extend base classes, which depends 
 * on how will the structure work :TODO:
 * must be run only once and after defining all of element's extensions
 */ 

// >> extensions to Element
if (!document.all) JAM.onReady(function(){ 
	extend(Element.prototype, JAM.Dom.Element);
});
// <<

