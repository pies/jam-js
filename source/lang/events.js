
// Events
// Modified version of MochiKit's Signal classes
// >> from MochiKit

extend('JAM.Lang.Events', {

	specialKeys: {
		KEY_SPACE: 32, KEY_ENTER: 13, KEY_ESCAPE: 27, KEY_BACKSPACE: 8, KEY_TAB: 9, 
		KEY_SHIFT: 16, KEY_CTRL: 17, KEY_ALT: 18, KEY_PAUSE: 19, KEY_SELECT: 93, 
		KEY_LEFT_ARROW: 37, KEY_UP_ARROW: 38, KEY_RIGHT_ARROW: 39, KEY_DOWN_ARROW: 40, 
		KEY_INSERT: 45, KEY_DELETE: 46, KEY_HOME: 36, KEY_END: 35, KEY_PAGE_UP: 33, KEY_PAGE_DOWN: 34, 
		KEY_LEFT_WINDOW: 91, KEY_RIGHT_WINDOW: 92, KEY_CAPS_LOCK: 20, KEY_NUM_LOCK: 144, KEY_SCROLL_LOCK: 145, 
		KEY_F1: 112, KEY_F2: 113, KEY_F3: 114, KEY_F4: 115,  KEY_F5: 116,  KEY_F6: 117,
		KEY_F7: 118, KEY_F8: 119, KEY_F9: 120, KEY_F10: 121, KEY_F11: 122, KEY_F12: 123
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

	/* this could be used for a lot of things: DOMContentLoaded etc.  */
	normalize: {
		mousewheel: function(){
			if(!(JAM.Browser.is('Opera') || JAM.Browser.is('IE'))){
				return 'DOMMouseScroll';
			}
			return 'mousewheel';
		}
	},

	_mouseButtons:  [],

	_initMouseTracker: function(){
		connect(window, ['mouseup', 'mousedown'], this._trackMouseButtons.bind(this));
	},

	_trackMouseButtons: function(event){
		var E = event.event;
		var B = E.which? 
			(1 == E.which? 'L': (2 == E.which? 'M': (3 == E.which? 'R': false))):
			(1 & E.button? 'L': (4 & E.button? 'M': (2 & E.button? 'R': false)));

		var P = this._mouseButtons || [];
		var T = E.type || '';

		this._mouseButtons = ('mousedown' == T)? P.add(B): P.not(B);
	},

	connect: function (obj, name, context, func) {
		if (window.$) obj = $(obj);
		if (!obj) return obj;

		/* or see normalize method */
		if (name == 'mousewheel' && !(JAM.Browser.is('Opera') || JAM.Browser.is('IE'))){ 
			name = 'DOMMouseScroll';						 
		} 

		var onlyOne = (JAM.Lang.Type && JAM.Lang.Type.isString(name));

		var names = onlyOne? [name]: name;

		if (isFunction(context)) {
			func = context; 
			context = obj;
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

	// normalized to 1;	
	wheel: function () {
		if (!this.event) return 0;
		var delta = 0;
		var E = this.event;
		delta = E.wheelDelta ? E.wheelDelta : - E.detail;
		if(JAM.Browser.is('Opera'))delta =-delta;
		return delta ? delta/Math.abs(delta): 0
	},

	// >> from Mochikit & Prototype
	mouse: function () { 
		var E = this.event;

		if (!E || !this.type || !this.type.match(/mouse|click|contextmenu/)) return;

		return {
			x: max( 0, E.clientX ),
			y: max( 0, E.clientY ),
			page: {
				x:  max( 0, E.pageX || (E.clientX + B.scrollLeft - B.clientLeft) ),
				y:  max( 0, E.pageY || (E.clientY + B.scrollTop  - B.clientTop) )
			},
			buttons: JAM.Lang.Events._mouseButtons
		}
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
