(function (window)  {

	function RotationDial() {
		this.initialize();
	}
	
	RotationDial.prototype = new Shape();
	RotationDial.prototype.Shape_initialize = RotationDial.prototype.initialize;
	
	//constructor
	RotationDial.prototype.initialize = function () {
		this.Shape_initialize();
		this.selected = false;
		this.visible = false;
		this.size  = 200;
		
		//this.regX = -this.size / 2;
		//this.regY = -this.size / 2;
		
		this.selection = null;
		
		this.makeShape();
	}
	
	RotationDial.prototype.show = function() {
	
		if (this.selection.length <2) return;
	
		var selCenter = this.selection.getCenter();
    	this.x = selCenter.x;
    	this.y = selCenter.y;
		this.visible = true;
		setDirty();
	}
	
	RotationDial.prototype.hide = function () {
		this.visible = false;
		setDirty();
	
	}
	
	RotationDial.prototype.onPress = function (evt) {
	
		evt.onMouseMove = function (evt) {
		
		
		};
		
		evt.onMouseUp = function (evt) {
		
		
		};
	}
	
	RotationDial.prototype.onMouseOver = function() {
	
	}
	
	RotationDial.prototype.onMouseOut = function() {
	
	}
	
	RotationDial.prototype.makeShape = function() {
		this.graphics.clear();
		
		//this.graphics.beginFill("rgba(0,0,0,0.2)").drawCircle(0,0,this.size/2 * 0.8).endFill();
		this.graphics.beginFill("rgba(0,0,0,0.2)").drawCircle(0,0,this.size * 0.3).endFill();
		
		this.createTicks(10, 0.8, 1, 2);
		this.createTicks(5,  0.8, 0.9);
		//this.createTicks(2,  1, 0.95);
		
		this.createTicks(10, 0.3, 0.4);

			
		setDirty();
	}
	
	RotationDial.prototype.createTicks = function(increment, percentStart, percentEnd, stroke, color) {
		
		if (color === undefined) color = this.getDialTickColor();
		if (stroke === undefined) stroke = 1;
		
		var p1 = new Point2D(0,-this.size/2 * percentStart);
		var p2 = new Point2D(0,-this.size/2 * percentEnd);
		
		var pivot = new Point2D(0,0);
		
		var stops = 360 / increment; 
		
		for (var i=0;i<stops;i++) {
			this.graphics.beginStroke(color);
			this.graphics.setStrokeStyle(stroke);

			this.graphics.moveTo(p1.x, p1.y)
					 	 .lineTo(p2.x, p2.y)
					 	 .closePath();
					 	 
			p1.rotate(increment, pivot);
			p2.rotate(increment, pivot);		 	 	
		}
	}
	
	RotationDial.prototype.getDialTickColor = function() {
		return colors.defaultDialTickStoke;
	}

	window.RotationDial = RotationDial;
}(window));