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