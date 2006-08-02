
provides('Lang.Shape');

JAM.Lang.Shape = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};
	
extend( JAM.Lang.Shape.prototype, {

	contains: function(A) { 
//		debug(A.x,A.y);
		return !(
			A.x < this.x || 
			A.y < this.y || 
			A.x + (A.w || 0) > this.x + this.w || 
			A.y + (A.h || 0) > this.y + this.h
		);
	}

});
