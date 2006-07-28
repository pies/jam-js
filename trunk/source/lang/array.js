
extend('JAM.Lang.Array', {

	// EMPTIES
	empty: function(){
		while (this.length) this.shift();
		return this;
	},

	// ITERATES over each element with a CALLBACK (F)unction
	each: function(F) {
		for (var i = 0; i < this.length; ++i) {
			F.apply(this[i], [this[i], i]);
		}
		return this;
	},

	// ITERATES over each element with a CALLBACK (F)unction COLLECTING return VALUES
	collect: function(F) {
	    var R = [];
	    this.each(function(I,N) {
			R.push( F.apply(I, [I,N]) );
	    });
	    return R;
	},

	// Returns an array of values where F(value) == true
	// >> from Prototype
	filter: function(F) {
		var R = [];
		this.each(function(I,N){
			if (F.apply(I, [I,N])) R.push(I);
		});
		return R;
	},
	// <<

	add: function(A) {
		this.push(A);
		return this;
	},

	only: function(AA) {
		AA = $A(AA);
		return this.filter(function(N){
			return AA.has(N);
		});
	},

	not: function(AA) {
		AA = $A(AA);
		return this.filter(function(N){
			return AA.hasnt(N);
		});
	},

	// Returns the last element for which F(elem,best) was true
	// Used by min() and max().
	choose: function(F) {
		var best = this.shift();
		this.each(function(elem){
			if (F(elem,best)) best = elem;
		});
		return best;
	},

	min: function () {
		return this.choose(Math.min);
	},

	max: function () {
		return this.choose(Math.max);
	},

	// Returns an array of elements that are also in the specified range
	limitTo: function(range) {
		return this.filter(range.has);
	},

	// Returns an array containing values from properties specified by P
	// >> from Prototype
	pluck: function(K) {
		return this.collect(function() {
			return this[K] || undefined;
		});
	},
	// <<

	// Return an array of NON-EMPTY values
	// >> from Prototype
	compact: function() {
		var R = [];
		this.each(function(F){
			if (!isNull(F) && F) R.push(F);
		});
		return extend(R, JAM.Lang.Array);
	},
	// <<

	// Converts a multi-dimensional array into a flat list.
	// >> from Prototype
	flatten: function() {
		var R = [];
		this.each(function(item){
			R = R.concat(isArray(item)? $A(item).flatten() : [item]);
		});
		return R;
	},
	// <<

	// Converts an ITERABLE object TO an ARRAY
	// >> from Prototype
	from: function(obj) {
		if (!obj)          return [];
		if (!obj.length)   return [obj];
		if (isString(obj)) return [obj];
		if (obj.toArray)   return obj.toArray();

		var O = [];
		for (var i=0; i < obj.length; i++) {
			O.push(obj[i]);
		}
		return O;
	},
	// <<

	has: function(I) {
		for (var F in this){
			if (this[F] == I) return true;
		}
		return false;
	},

	hasnt: function(I) {
		return !($A(this).has(I));
	},

	unique: function() {
		var result = [];
		this.each(function(elem){
			if (!(result.has(elem))) result.push(elem);
		});
		return result;
	},

	skip: function(N) {
		for ( i=0 ; i<(N||1) ; ++i ) {
			this.shift;
		}
	},

	isEqualTo: function(A) {
		this.each(function(I,N){
			if ((I && I.isEqualTo && !I.isEqualTo(A[N])) || I != A[N]) return false;
		});
		return true;
	}

});


// >> extensions
extend(Array.prototype, JAM.Lang.Array);
// <<

// >> aliases
var $A = JAM.Lang.Array.from;
// <<
