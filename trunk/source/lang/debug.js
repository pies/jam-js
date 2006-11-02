
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
	function debug (msg) {
		reportStatus.push(msg);
		alert(reportStatus.join ("\n"));
	}
	window.onerror = function (err, url, line) {
		debug( err + " [" + url + " - line " + line + "]" );
	}
}
else {
	// We really should downgrade to something better than alert()
	var debug_output = document.getElementById('debug');
	var debug = debug_output?
		function(msg){ debug_output.innerHTML += (msg); }:
		function(msg){ alert(msg + "\n\n" + '(Please add <pre id="debug"></pre> to your document to remove this message)'); };
	var trace = alert;
}
