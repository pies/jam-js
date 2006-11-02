
provides('Dom.Element');
requires('Shape');

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

	setArea: function(A) {
		this.setPosition({ x:A.x, y:A.y });
		this.setSize({ w:A.w, h:A.h });
		return this;
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
		return pos?
			this.setPosition(pos):
			this.getPosition();
	},

	makePositioned: function() {
		var pos = this.getCss('position');
		if (pos == 'static' || !pos) {
			this.setCss({ position: 'absolute', margin:'' });
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


// >> <?=insert('element/size')?>
// >> <?=insert('element/css')?>
// >> <?=insert('element/opacity')?>
// >> <?=insert('element/events')?>


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
