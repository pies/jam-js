
if (JAM.Browser.is('Opera')) {
	var debug = window.opera.postError;
	var trace = window.opera.postError;
}
else if (JAM.Browser.is('FF')) {
	var debug = window.console.debug;
	var trace = window.console.trace;
}
else if (JAM.Browser.is('IE')) {
	var reportStatus = new Array();
	function report ( msg ) {
		reportStatus.push ( msg );
	}
	function showReport ( err ) {
	    alert ( reportStatus.join ( "\n" ) );
	}
	window.onerror = function ( err, url, line ) {
		report ( err + " [" + url + " - line " + line + "]" );
	    showReport();
	}
}
else {
	var debug = alert;
	var trace = alert;
}
