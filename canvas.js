var two_pi = Math.PI * 2;

function Canvas (canvas){
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
};

Canvas.prototype={
	adjust: function(pos) {
		var location = $('canvas').position(),
			lx = location.left,
			ly = location.top,
			px = pos.x,
			py = pos.y;

		return new Vector((pos.x - lx) / this.canvas.width, (pos.y - ly) / this.canvas.height);
	},
	
	clear: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
	
	line: function(x1, x2){
		this.ctx.strokeStyle = 'rgb(117, 128, 121)';
		this.ctx.lineWidth = 0.5;
		this.ctx.beginPath();
		this.ctx.moveTo(x1.x * this.canvas.width, x1.y * this.canvas.height);
		this.ctx.lineTo(x2.x * this.canvas.width, x2.y * this.canvas.height);
		this.ctx.stroke();
	},
};