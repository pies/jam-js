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
