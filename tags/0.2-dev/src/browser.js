
JAM.Browser = {
	os:      null,
	name:    null,
	version: null,

	guess: function(){
		var a = navigator.userAgent;

		if (a.indexOf("Macintosh") >= 0)      { this.os = 'Mac'; }
		else if (a.indexOf("Windows") >= 0)   { this.os = 'Windows'; }
		else if (a.indexOf("X11") >= 0)       { this.os = 'Linux'; }
		else { this.os = 'unknown'; }

		if (a.indexOf("Opera") >= 0)          { this.name = 'Opera'; }
		else if (a.indexOf("Konqueror") >= 0) { this.name = 'KHTML'; }
		else if (a.indexOf("Safari") >= 0)    { this.name = 'Safari'; }
		else if (a.indexOf("Gecko") >= 0)     { this.name = 'Mozilla'; }
		else if (document.all)                { this.name = 'IE'; }
		else { this.name = 'unknown'; }

		this.version = parseFloat(navigator.appVersion);
	},

	is: function(name, version) {
		if (!this.name) JAM.Browser.guess.apply(JAM.Browser);

		if (name == 'FF' || name == 'Firefox') name = 'Mozilla';
		if (name == 'O') name = 'Opera';

		return this.name.match(name) && (!version || (this.version == version.parseFloat()));
	}

};
