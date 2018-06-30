function Vector(x,y){
	this.x = x;
	this.y = y;
};

Vector.prototype = {
	add: function (B,internal) {
		var nx, ny;
		if (typeof(B)=='number'){
			nx = this.x+B;
			ny = this.y+B;
		}else{
			nx = this.x+B.x;
			ny = this.y+B.y;
		}
		return new Vector(nx,ny);
	},

	dot: function(B) {
		return ((this.x*B.x)+(this.y*B.y));
	},

	length: function() {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},

	multiply: function(B) {
		var nx, ny;
		if (typeof(B)=='number'){
			nx = this.x*B; ny = this.y*B;
		}else{ 
			nx = this.x*B.x; ny = this.y*B.y;
		}
		return new Vector(nx,ny);
	},

	squaredLength: function(args) {
		return (this.x*this.x)+(this.y*this.y);
	},

	subtract: function(B) {
		var nx, ny;
		if (typeof(B) == 'number'){
			nx = this.x-B; ny = this.y-B;
		}else{
			nx = this.x-B.x; ny = this.y-B.y;
		}
		return new Vector(nx,ny);
	},

};