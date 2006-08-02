
var DOC = {};

JAM.Compat = {

	init: function(){
		DOC.Body = document.documentElement || document.body;
	}

};

JAM.onReady(JAM.Compat.init);
