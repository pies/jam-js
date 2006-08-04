
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
	// We really should downgrade to something better than alert()
	var debug = (document.getElementById('debug')) ?  
    function(msg){ 
       $('#debug').html('<pre>' + msg + '</pre>'); 
    } 
    : function(msg){
        alert('you can get rid of this error by creating a div with id="debug"\n\n' + msg);
    }
	var trace = alert;
}
