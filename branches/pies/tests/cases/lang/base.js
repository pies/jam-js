// I: Input
// F: Function
// E: Expected
// R: Result

TEST.addCase('JAM.lang.base', {

	before: function(){
		var P = document.createElement('P');
		P.id = 'test';
		P.style.visibility = 'hidden';
		document.body.appendChild(P);
	},

	after: function(){
		var P = document.getElementById('test');
		P.parentNode.removeChild(P);
	},

	testIntegrity: function(){

		var I = [extend, Class, getType, isEqual, function(){ alert('Noob') }];
		var E = 4; // the "alert('Noob')" method is not actually implemented
		var R = 0; // but we like to do a sanity check on a sanity check
		var T = $A((JAM.lang.base));
		for (f in JAM.lang.base) {
			if (I.has(JAM.lang.base[f])) { R++ }
		}

		this.assertEqual(E, R);
	},

	testClass: function() {
		var E = true;
		var R = false;
		var C = Class();
		C.prototype = { init: function(){ R = true } };
		this.assertEqual(false, R);

		var I = new C();
		this.assertEqual(true, R);
	},

	testExtend: function() {
		var A = { one: 'foo', two: 'bar' };
		var B = {};
		extend(B, A);
		this.assertEqual(A, B);

		var B = { one: 'baz', two: 'woops' };
		extend(A, B);
		this.assertEqual(A, B);
	},

	testIsNull: function() {
		var R = [];
		[undefined,null,false,,'ABC',{},[]].each(function(N){ R.push(isNull(N)) });
		var E = [true,true,false,true,false,false,false];
		this.assertEqual(E, R);
	},

	testIsEmpty: function() {
		this.assertEqual(
			[true,      true,  true, true, false, false, false, false, false, false, false],
			[undefined, null, false,     , 'ABC',    {},    [],    1,    '2',    03,   [4]].collect(function(N){
				return isEmpty(N);
			})
		);
	},

	testIsNumber: function() {
		var I = [1,'2',03,[4],5];
		var E = [true, false, true, false, true];
		var R = [];
		I.each(function(n){ R.push(isNumber(n)) });
		this.assertEqual(E, R);
	},

	testIsFunction: function() {
		var I = [{}, function(){}, isNumber, JAM.lang.base.Class, null];
		var E = [false, true, true, true, false];
		var R = [];
		I.each(function(n){ R.push(isFunction(n)) });
		this.assertEqual(E, R);
	},

	testIsObject: function() {
		var I = [{}, function(){}, JAM, JAM.lang.base.Class, null];
		var E = [true, false, true, false, false];
		var R = [];
		I.each(function(n){ R.push(isObject(n)) });
		this.assertEqual(E, R);
	},

	testIsElement: function() {
		var T = document.getElementById('test');
		var I = [T,{},function(){},null,document];
		var E = [true,false,false,false,true];
		var R = [];

		I.each(function(n){ R.push(isElement(n)) });
		this.assertEqual(E, R);
	},

	testIsString: function() {
		var T = document.getElementById('test');
		var I = [T, 'a', 'b', '', null, false, function(){}, document];
		var E = [false,true,true,true,false,false,false,false];
		var R = [];
		I.each(function(n){ R.push(isString(n)) });
		this.assertEqual(E, R);
	},

	testIsArray: function() {
		var I = [[], {}, [,,,],, null, false, function(){}, document];
		var E = [true,false,true,false,false,false,false,false];
		var R = [];
		I.each(function(n){ R.push(isArray(n)) });
		this.assertEqual(E, R);
	},

	testGetType: function() {
		var I = [[], {}, 'a', 5, null, document.getElementById('test'), false, function(){}, document];
		var E = ['array','object','string','number','null','element',false,'function','element'];
		var R = [];
		I.each(function(n){ R.push(getType(n)) });
		this.assertEqual(E, R);
	},

	testIsEqual: function() {
		var F = function(){ test };
		var O = { m: F };
		this.assertEqual(true,  isEqual([1,2,3], [1,2,3]));
		this.assertEqual(true,  isEqual(F, O.m));
		this.assertEqual(false, isEqual(function(){}, function(){}));
	}

});
