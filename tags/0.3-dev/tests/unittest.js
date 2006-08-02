
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};


Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};



var UnTestCase = Class.create();
UnTestCase.prototype = {

	name: '',

	before: function(){},
	after:  function(){},

	passed: [],
	failed: [],

	initialize: function(N) {
		extend(this, {
			name: N,
			passed: [],
			failed: []
		});
	},

	assertEqual: function(expected, result, msg) {
		if (!isEqual(expected, result)) {
			throw({
				expected: expected,
				result:   result,
				reason:   msg || 'assertEqual: Expected and result are not equal'
			});
		}
	},

	assertNotEqual: function(expected, result, msg) {
		if (isEqual(expected, result)) {
			throw({
				expected: expected,
				result:   result,
				reason:   msg || 'assertNotEqual: Expected and result are equal'
			});
		}
	},

	assertTrue: function(result, msg) {
		if (result !== true) {
			throw({
				expected: true,
				result:   result,
				reason:   msg || 'assertTrue: Result is not true'
			});
		}
	}

};


var UnTest = Class.create();
UnTest.prototype = {

	name:'',
	outputElement:null,
	cases:[],
	results:[],

	initialize: function(N) {
		this.name = N;
		this.output = this._getOutputElement();
	},

	addCase: function(N, O) {
		var C = new UnTestCase(N);
		Object.extend(C, O);
		this.cases.push(C);
	},

	run: function() {
		var self = this;

		self._say('[Starting test suite '+this.name+']');

		var _R = { passed: 0, failed: 0 };
		this.cases.each(function(_C){

			//_R = { passed: 0, failed: 0 };

			for (var _T in _C) {
				if (_T.indexOf('test') !== 0) continue;

				_C.before();

				try {
					_C[_T]();

					_C.passed.push({
						name: _T,
						code: _C[_T]
					});
				}
				catch(_E) {
					_C.failed.push({
						name: _T,
						code: _C[_T],
						reason: _E
					});

					var msg = '[*'+(_E.reason || _E) + '*]' + (_E.reason? '. Expected: '+(_E.expected)+'. Result: '+(_E.result): '');
					self._say('[*'+_C.name+'.'+_T+' failed*], reason: '+msg);
				};

				_C.after();
			};

			if (_C.failed.length) _R.failed++; else _R.passed++;

			self._say('Test of ['+_C.name+'] completed, ['+_C.passed.length+'] passed, ['+_C.failed.length+'] failed.');
		});

		self._say('[Summary: '+_R.passed+' passed, '+_R.failed+' failed.]');
	},



	_getOutputElement: function() {
		var D = document.getElementById('test_output');
		if (D) return D;

		var D = document.createElement('DIV');
		D.id = 'test_output';
		D.className = 'TestOutput';
		document.body.appendChild(D);
		return D;
	},

	_say: function(M) {
		trace(M);
		var P = document.createElement('P');
		this.output.appendChild(P);
		P.innerHTML = M
			.replace(/\[\*/g, '<strong>')
			.replace(/\*\]/g, '</strong>')
			.replace(/\[/g, '<em>')
			.replace(/\]/g, '</em>')
			.replace(/\. /g, '<br/>');
	}
}


var Test = Class.create();
Test.prototype = {

	unit:   '',
	name:   '',
	passed: [],
	failed: [],
	output: null,

	initialize: function(unit_name) {
		this.unit   = unit_name;
		this.name   = '';
		this.passed = [];
		this.failed = [];
		this.output = this._getOutputElement();
	},

	start: function(name) {
		this.name = name;
	},

	end: function(name) {
		this._say('Testing ['+this.unit+'] completed, ['+this.passed.length+'] passed, ['+this.failed.length+'] failed.');
	},

	assertEqual: function(expected, result) {
		if (areEqual(expected, result)) {
			this.passed.push([this.name, expected, result]);
		}
		else {
			this.failed.push([this.name, expected, result]);
			this._say('Failed: '+this.unit+'/'+this.name+', expected:');
			this._say(expected);
			this._say('Result:');
			this._say(result);
		}
	},

	_getOutputElement: function() {
		var D = document.getElementById('test_output');
		if (D) return D;

		var D = document.createElement('DIV');
		D.id = 'test_output';
		D.className = 'TestOutput';
		document.body.appendChild(D);
		return D;
	},

	_say: function(M) {
		trace(M);
		var P = document.createElement('P');
		this.output.appendChild(P);
		P.innerHTML = M.replace(/\[/g, '<strong>').replace(/\]/g, '</strong>');
	}

};
