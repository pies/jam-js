TEST.addCase('JAM.dom.element', {

	testIntegrity: function(){
		var A = HTML.P();
		var E = ['append','css','hasClass','remove'];

		var self = this;
		E.each(function(N){
			self.assertEqual(A[N], JAM.dom.element[N]);
		});
	}

});