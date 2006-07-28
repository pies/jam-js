
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
 