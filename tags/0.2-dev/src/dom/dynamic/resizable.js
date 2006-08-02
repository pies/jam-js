
extend('JAM.Dom.Resizable', {

	element:       false,
	content:       false,
	offset:        { x:0, y:0 },
	contentOffset: { x:0, y:0 },
	previous:      { x:0, y:0 },
	eventHandler:  null,
	
	init: function() {
//		var self = this;
//		this.apply = this.apply.bind(this);
//		$$('.ResizeHandle').each(function(elem){
//			elem.on('mousedown', self.pickUp.bind(self));
//			elem.parentNode.params = { content: $('.BoxContentWrap', elem.parentNode) || false };
//		});
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

onLoad(JAM.Dom.Resizable.init, JAM.Dom.Resizable);
