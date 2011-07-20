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
		this.rotation = 0;
		setDirty();
	
	}
	
	RotationDial.prototype.onPress = function (evt) {
	
		var origX = evt.stageX;
        var origY = evt.stageY;
        var origRotation = 0;
        
        var dial = this;
        var prevAngle = 0;
        var angle;
        var predefinedAngle = 20;
       
		evt.onMouseMove = function (evt) {
            angle = dial.getAngle(new Point2D(origX, origY),new Point2D(evt.stageX,evt.stageY));
            
            //FIXME : something must be wrong somewhere, we shouldn't have to substract 180.
            angle = angle - 180;
            
            delta = angle - prevAngle;
            
            if (evt.nativeEvent.shiftKey) {
				if (delta > 0) {
					angle = dial.rotation + predefinedAngle;
					delta = predefinedAngle;
				} else {
					angle = dial.rotation - predefinedAngle;
					delta = -predefinedAngle;
				}
            }
                        
            dial.rotation = angle;
            
            for (var i=0; i<dial.selection.length; i++) {
            	var refPoint = new Point2D(dial.selection[i].x, dial.selection[i].y);
            	refPoint.rotate(delta, new Point2D(dial.x, dial.y));
            	
            	dial.selection[i].move(refPoint.x, refPoint.y);
            	dial.selection[i].rotate(dial.selection[i].rotation + delta);
       		}
       		
    		prevAngle = angle;

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
		this.createTicks(10, 0.3, 0.4);
		
		this.graphics.beginStroke("#000000");
		this.graphics.setStrokeStyle(3);
		this.graphics.moveTo(0, -this.size/2 * 0.1)
					 .lineTo(0, +this.size/2 * 0.1)
					 .moveTo(-this.size/2 * 0.1, 0)
					 .lineTo(+this.size/2 * 0.1, 0)
					 .closePath();
		
		/*
		 * Vertical line
		 *
		 
		this.graphics.moveTo(0,0)
					 .lineTo(0, -this.size/2)
					 .closePath();
		 */
			
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
	
	RotationDial.prototype.getAngle = function (origin, target) {
	
		//Create Vectors
		var vectorA = new Object;
		vectorA.p1 = new Point2D(this.x, this.y);
		vectorA.p2 = new Point2D(origin.x, origin.y);
		
		var vectorB = new Object;
		vectorB.p1 = new Point2D(this.x, this.y);
		vectorB.p2 = new Point2D(target.x, target.y);
	
        // Make reference line a vector
        var Ax = vectorA.p2.x - vectorA.p1.x;
        var Ay = vectorA.p2.y - vectorA.p1.y;

        var Bx = vectorB.p1.x - vectorB.p2.x;
        var By = vectorB.p1.y - vectorB.p2.y;

        // Get the vector length
        var Alen = Math.sqrt(Ax * Ax + Ay * Ay);
        var Blen = Math.sqrt(Bx * Bx + By * By);

        // Make unit length
        // To work the coordinate system with an origin in the lower left rather than upper left corner
        // negate the y coords by adding a unary minus to rdy and dy in the division below.
        Ax = Ax / Alen;
        Ay = Ay / Alen;
        Bx = Bx / Blen;
        By = By / Blen;

        // Dot product and convert to degrees
        // To leave in radians just do: return ( Math.acos ( rdx * dx + rdy * dy ) );
        //return ( Math.acos ( rdx * dx + rdy * dy ) / 6.28 * 360 );	
        return (Math.atan2(By, Bx) - Math.atan2(Ay, Ax)) / (Math.PI * 2 / 360);
    }

	window.RotationDial = RotationDial;
}(window));