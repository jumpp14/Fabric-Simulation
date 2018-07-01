$(document).ready(function(){
	var canvas = new Canvas(document.getElementsByTagName('canvas')[0]),
		cloth = new Cloth(canvas),
		point,
		isMouseDown, mousePosition;
	
	var position = function(event){
		return canvas.adjust({
			x: event.pageX,
			y: event.pageY
		});
	};

	var setPoint = function(inv_mass){
		if (!point) return;
		if (mousePosition) {
			point.setCurrent(mousePosition);
			point.setPrevious(mousePosition);
		}
		point.inv_mass = inv_mass;
	};


	$("canvas").mousedown(function(event){
		isMouseDown = true;
		mousePosition = position(event);;
		// console.log(mousePosition);
		
		if (!mousePosition) return;
		point = cloth.getClosestPoint(mousePosition);
		setPoint(0);

	});

	$("canvas").mouseup(function(event){
		isMouseDown = false;
		if (mousePosition) setPoint(1);

	});

	$("canvas").mousemove(function(event){
		if (!isMouseDown) return;

		mousePosition = position(event);;
		setPoint(mousePosition ? 0 : 1);

	});
	
	setInterval(cloth.update.bind(cloth), 35);
});

function Cloth(canvas){
	var max_points = 30,
		width = canvas.width,
		height = canvas.height,
		max_dim = Math.max(width, height),
		min_dim = Math.min(width, height),
		x_offset = width * 0.1,
		y_offset = height * 0.1,
		spacing = (max_dim - (Math.max(x_offset, y_offset) * 2)) / max_points,
		fabric;
	
	this.spacing = spacing;
	this.num_iterations = 2;
	this.canvas = canvas;
	this.points = [];
	this.constraints = [];

	var num_x_points = this.num_x_points = Math.round(max_points * (width / max_dim));
	var num_y_points = this.num_y_points = Math.round(max_points * (height / max_dim));
	
	var constraint;
	
	for (var i = 0, y = y_offset; i < num_y_points; i++, y += spacing){
		this.points[i] = [];
		
		for (var j = 0, x = x_offset; j < num_x_points; j++, x += spacing){
			var point = new Point(canvas, x / width, y / height);
			this.points[i][j] = point;
			
			//add a vertical constraint
			if (i > 0){
				constraint = new Constraint(canvas, this.points[i - 1][j], this.points[i][j]);
				this.constraints.push(constraint);
			}
			
			//add a new horizontal constraints
			if (j > 0){
				constraint = new Constraint(canvas, this.points[i][j - 1], this.points[i][j]);
				this.constraints.push(constraint);
			}
		}
	}
	//pin the top points
	this.points[0][0].inv_mass = 0;
	this.points[0][Math.floor(num_x_points / 3)].inv_mass = 0;
	this.points[0][Math.floor(num_x_points / 3 * 2)].inv_mass = 0;
	this.points[0][num_x_points - 1].inv_mass = 0;

	this.num_constraints = this.constraints.length;
};

Cloth.prototype = {
	update: function() {
		this.canvas.clear();

		this.fabric = $("input[name='fabric_type']:checked").val();
		
		var num_x = this.num_x_points,
			num_y = this.num_y_points,
			num_c = this.num_constraints,
			num_i = this.num_iterations,
			i, j;
			
		//move each point with a pull from gravity
		for (i = 0; i < num_y; i++){
			for (j = 0; j < num_x; j++){
				this.points[i][j].move();
			}
		}
		
		//make sure all the constraints are satisfied.
		//iterates twice
		for (j = 0; j < num_i; j++){
			for (i = 0; i < num_c; i++){
				this.constraints[i].satisfy();
			}
		}

		function lerp(a, b, p) {
			return (b-a)*p + a;
		}

		if(this.fabric == "thin_cloth"){
			document.getElementsByTagName('canvas')[0].style.backgroundColor = 'rgb(249, 252, 201)';
			for (i = 1; i < num_y; i++){
				for (j = 1; j < num_x; j++){
					this.canvas.ctx.fillStyle = "rgba(47, 225, 214, 0.25)";
					this.canvas.ctx.beginPath();
					this.canvas.ctx.moveTo(this.points[i][j].getCurrent().x * this.canvas.width,this.points[i][j].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i-1][j].getCurrent().x * this.canvas.width,this.points[i-1][j].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i-1][j-1].getCurrent().x * this.canvas.width,this.points[i-1][j-1].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i][j-1].getCurrent().x * this.canvas.width,this.points[i][j-1].getCurrent().y * this.canvas.height);
					this.canvas.ctx.fill();
				}
			}
		}

		else if(this.fabric == "tension_cloth") {
			document.getElementsByTagName('canvas')[0].style.backgroundColor = 'black';
			for (i = 1; i < num_y; i++){
				for (j = 1; j < num_x; j++){
					var tension = this.points[i-1][j].getCurrent().subtract(this.points[i][j].getCurrent()).length();
					var coef = Math.round(Math.abs(tension * this.canvas.height - (this.spacing/2) - 8.4) * (255 / 1.9));

					this.canvas.ctx.fillStyle = "rgba(" + lerp(100, 200,coef/255.0) + ",0," + lerp(100, 255, 1 - coef/255.0)+ "," + lerp(0.2, 0.7,coef/255.0) + ")";
					this.canvas.ctx.beginPath();
					this.canvas.ctx.moveTo(this.points[i][j].getCurrent().x * this.canvas.width,this.points[i][j].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i-1][j].getCurrent().x * this.canvas.width,this.points[i-1][j].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i-1][j-1].getCurrent().x * this.canvas.width,this.points[i-1][j-1].getCurrent().y * this.canvas.height);
					this.canvas.ctx.lineTo(this.points[i][j-1].getCurrent().x * this.canvas.width,this.points[i][j-1].getCurrent().y * this.canvas.height);
					this.canvas.ctx.fill();
				}
			}
		}

		else {
			document.getElementsByTagName('canvas')[0].style.backgroundColor = 'rgb(255, 210, 210)';
			for (i = 0; i < this.num_constraints; i++){
				this.constraints[i].draw();
			}
		}
	},
	
	getClosestPoint: function(pos) {
		var min_dist = 1,
			min_point = null,
			num_x = this.num_x_points,
			num_y = this.num_y_points,
			dist, i, j;
		
		for (i = 0; i < num_y; i++){
			for (j = 0; j < num_x; j++){
				dist = pos.subtract(this.points[i][j].getCurrent()).length();
				
				if (dist < min_dist){
					min_dist = dist;
					min_point = this.points[i][j];
				}
			}
		}
		return min_point;
	},
};