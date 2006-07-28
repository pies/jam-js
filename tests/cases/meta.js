// This file tests some global assumptions about the Javascript environment the framework
// is supposed to work in.

TEST.addCase('JAM.meta', {

	testPurity: function(){

		// By default, objects are expected to have no properties.
		var I = {};
		var E = 0;
		var R = 0;
		for (var T in I) { R++ }
		this.assertEqual(E, R);

	}

});
