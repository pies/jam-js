// I: Input
// F: Function
// E: Expected
// R: Result

TEST.addCase('JAM.lang.array', {

	testIntegrity: function(){

		var I = [];
		var E = 1; // integrity check on collect() fails on purporse
		var R = 0; // of testing the integrity of the integrity check
		var C = Array.prototype.collect;
		Array.prototype.collect = function(){ /* I fail */ };
		for (f in JAM.lang.array) {
			if (JAM.lang.array[f] != I[f]) R++;
		}
		Array.prototype.collect = C;
		this.assertEqual(E, R);
	},


	//from
	//uses
	//shift
	//pop

	testArrayEach: function(){

		var I = [1,2,3,4];
		var R = 0;
		var F = function(n) { R += n; };
		I.each(F);
		this.assertEqual(10, R);

		var I = [];
		var R = 0;
		var F = function(n) { R += 1; };
		I.each(F);
		this.assertEqual(0, R);
	},

	testArrayCollect: function(){

		var I = [1,2,3,4];
		var E = [1,2,3,4];
		var F = function(N) { return N; };
		var R = I.collect(F);
		this.assertEqual(E, R);

		var E = [[1,2],[2,4],[3,6],[4,8]];
		var F = function(n) { return [n, n*2]; };
		var R = I.collect(F);
		this.assertEqual(E, R);
	},

	testArrayCompact: function(){

		var I = [,1,2,,3,,4];
		var E = [1,2,3,4];
		var R = I.compact();
		this.assertEqual(E, R);

		var I = [undefined,,false,null,0];
		var E = [];
		var R = I.compact();
		this.assertEqual(E, R);
	},

	testArrayFilter: function(){

		var I = [1,2,3,4];
		var F = function(N) { return (N % 2) };
		var E = [1,3];
		var R = I.filter(F);
		this.assertEqual(E, R);

		var I = [2,4,,6,2,0];
		var F = function(n) { return n; };
		var E = [2,4,6,2];
		var R = I.filter(F);
		this.assertEqual(E, R);

		var I = [1,2,3,4];
		var F = function(n) { return false; };
		var E = [];
		var R = I.filter(F);
		this.assertEqual(E, R);
	},

	testArrayPluck: function(){

		var I = [ {a:1,b:2}, {a:3,b:4}, {a:5,b:6} ];
		var E = [1,3,5];
		var R = I.pluck('a');
		this.assertEqual(E, R);

		var E = [2,4,6];
		var R = I.pluck('b');
		this.assertEqual(E, R);

		try{
		var E = [undefined,undefined,undefined];
		var R = I.pluck('c');
		this.assertEqual(E, R);
		}catch(Ex){alert(Ex)}
	},

	//flatten

	testArrayHas: function(){

		var I = [1,2,3,4];
		this.assertEqual(true,  I.has(2));
		this.assertEqual(false, I.has('foo'));
		this.assertEqual(false, I.has(8));

		var A = function(){ R+=1 }; // this one gets copied to the O (passes)
		var O = { A: A, B: function(){ R+=2 }, C: function(){ R+=3 } };
		var B = O.B; // this one is copied _from_ the O (passes)
		var C = function(){ R+=2 }; // this one is the same as O.B, but it's not really related to O (fails)
		var I = [A,B,C];
		this.assertEqual(true,  I.has(O.A));
		this.assertEqual(true,  I.has(O.B));
		this.assertEqual(false, I.has(O.C));
	},

	testArrayUnique: function(){

		var I = [1,1,2,3,,4,1,4,2,7,1];
		var R = [1,2,3,,4,7];
		this.assertEqual(R, I.unique());

		var I = [1,3,5,7];
		var R = [1,3,5,7];
		this.assertEqual(R, I.unique());
	}


//isEqualTo

});
