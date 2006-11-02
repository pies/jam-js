
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
