
TEST.addCase('JAM.dom.selector', {

	before: function(){
		var P = HTML.P({ id: 'bar', className: 'Foo', css: { visibility: 'visible' }}, 'Testing');
		document.body.appendChild(P);
	},

	after: function(){
		var P = document.getElementById('bar');
		$('#bar').remove();
	},

	testIntegrity: function(){
		this.assertEqual($, JAM.dom.selector.getFirst);
		this.assertEqual($$, JAM.dom.selector.get);
	},

	testById: function(){
		this.assertEqual('p', $('#bar').tagName.toLowerCase());
		this.assertEqual(1, $$('#bar').length);
		this.assertEqual(0, $$('#zip').length);
	},

	testByClass: function(){
		this.assertEqual('bar', $('.Foo').id);
		this.assertEqual(1, $$('.Foo').length);
		this.assertEqual($('.Foo').id, $$('.Foo')[0].id);
	},

	testByTagName: function(){
		var R = $$('P');
		this.assertTrue(R.length > 0);
		this.assertTrue(R.has($('#bar')));
	},

	testByTagNameAndClass: function(){
		this.assertTrue($$('P.Foo').length > 0);
		this.assertTrue($$('INPUT.FooBar').length == 0);
	}

});
