
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
