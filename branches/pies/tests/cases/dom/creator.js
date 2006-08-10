
TEST.addCase('JAM.dom.creator', {

	testIntegrity: function(){
		var I = ['A', 'BR', 'BUTTON', 'CANVAS', 'DIV', 'FIELDSET', 'FORM',
				 'H1', 'H2', 'H3', 'HR', 'IMG', 'INPUT', 'LABEL', 'LEGEND',
				 'LI', 'OL', 'OPTGROUP', 'OPTION', 'P', 'PRE', 'SELECT',
				 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TEXTAREA',
				 'TFOOT', 'TH', 'THEAD', 'TR', 'TT', 'UL' ];

	 	var self = this;
		I.each(function(T){
			var R = HTML[T]();
			self.assertEqual(R.tagName.toLowerCase(), T.toLowerCase());
		});
	},

	testIntegration: function(){
		var R = HTML.P();
		this.assertTrue(R.hasClass != undefined);
		this.assertTrue(R.remove === JAM.dom.element.remove);
	},

	testCreateNode: function(){
		var A = HTML.P();
		this.assertEqual('p', A.tagName.toLowerCase());

		var B = HTML.P();
		this.assertNotEqual(A, B);
	},

	testAttributes: function(){
		var R = HTML.DIV({ id: 'test' });
		this.assertEqual('test', R.id);
	},

	testChildren: function(){
		var R;
		with (HTML) {
			R = DIV({ id: 'test' }, P({ id: 'testChild' }));
			this.assertEqual('testChild', R.childNodes[0].id);
		}
	},

	testNoAttributes: function(){
		var R;
		with (HTML) {
			R = DIV(P(INPUT(), LABEL()));
			this.assertEqual(1, R.childNodes.length);
			this.assertEqual(2, R.firstChild.childNodes.length);
		}
	}

});
