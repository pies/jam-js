/*
 * Responsible for starting up scripts that use the DOM, 
 * but want to be started as soon as possible (i.e. before 
 * the page is displayed)
 */

extend(JAM, {

	startupTasks: {},
	readyTimer: null,
	
	onReady: function (handler, context) {
		if (!JAM.startupTasks.ready) {
			JAM.prepareReadyEvent();
			JAM.startupTasks.ready = [];
		}
		JAM.startupTasks.ready.push(function(){ 
			return handler.apply(context||document); 
		});
	},

	onLoad: function (handler, context) {
		if (!JAM.startupTasks.load) {
			JAM.prepareLoadEvent();
			JAM.startupTasks.load = [];
		}
		JAM.startupTasks.load.push(function(){ 
			return handler.apply(context||document); 
		});
	},

	prepareLoadEvent: function() {
		connect(window, 'load', function(){ 
			JAM.performStartup('ready');
			JAM.performStartup('load');
		});
	},

	prepareReadyEvent: function() {
		var R = function(){ 
			JAM.performStartup('ready');
		}.bind(JAM);

		/* for Mozilla */
		connect(document, 'DOMContentLoaded', R);

		/* for IE */
		/*@cc_on @*/
		/*@if (@_win32)
		document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
		document.getElementById('#__ie_onload').onreadystatechange = function() {
			if (this.readyState == "complete") R(); 
		};
		/*@end @*/

		/* for Safari */
		if (/WebKit/i.test(navigator.userAgent)) { 
			JAM.readyTimer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) R(); 
			}, 10);
		}

		JAM.prepareLoadEvent();
	},

	performStartup: function(name) {
		if (JAM.readyTimer) clearInterval(JAM.readyTimer);
		if (!JAM.startupTasks[name]) return true;

		var handler = JAM.startupTasks[name].shift();
		while (handler) {
			handler();
			handler = JAM.startupTasks[name].shift();
		};

		return true;
	}
});
