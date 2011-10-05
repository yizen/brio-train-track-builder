(function (window) {

    function Carriage() {
    	this.type = "Carriage";
    
    	this.initialize();
    }

    Carriage.prototype = new Container();
    Carriage.prototype.Container_initialize = Carriage.prototype.initialize; //unique to avoid overriding base class
    // constructor:
    Carriage.prototype.initialize = function () {
        this.Container_initialize();

        this.carriage = new Shape();
        this.carriage.snapToPixel = true;
        
        //TODO : Generalize to more than to bogies.
        this.bogieFront = new Bogie();
        this.bogieBack  = new Bogie();
        
        this.addChild(this.bogieFront);
        this.addChild(this.bogieBack);
        
        this.bogieFrontdx = 20;
        this.bogieFrontdy = 15;
        
        this.regX = this.bogieFrontdx;
        this.regY = this.bogieFrontdy;
        
        this.bogieFront.x = this.bogieFrontdx;
        this.bogieFront.y = this.bogieFrontdy;
        
        this.bogieBackdx = 80;
        this.bogieBackdy = 15;
        
        this.bogieBack.x = this.bogieBackdx;
        this.bogieBack.y = this.bogieBackdy;
        
        this.bogieFrontMagnetism = new Object();
        
        this.makeShape();
        this.addChild(this.carriage);
        
        this.snapped = false;
        this.originalAngle = 0;
        
        //debug
        this.cp = new Array();
        this.r = 0;
        this.c = new Point2D();
    }

    Carriage.prototype.makeShape = function () {
        var g = this.carriage.graphics;

        g.clear();
        g.setStrokeStyle(1);
        g.beginStroke(colors.carriageStroke);
        g.beginFill(colors.carriageFill);
        g.drawRect(0, 0, 100, 30);
        
        for (var p in this.cp) {
        	g.beginFill("rgba(181,9,13,0.5)").endStroke();
        	g.drawCircle(this.cp[p].x - this.x, this.cp[p].y - this.y, 6);
        }
                
        if (this.r > 0) {
        	g.endFill().beginStroke("#62B71E");
        	g.drawCircle(this.c.x - this.x, this.c.y - this.y ,this.r);
        
        }
               
        setDirty();
    }
       Carriage.prototype.onPress = function (evt) { 
    
    	railroad.hideRotationDial();
    	railroad.forwardArrow.hide();
		railroad.backwardArrow.hide();
		
		this.originalAngle = this.rotation;
		

    	var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var draggedCarriage = this; //The dragged element.
        
        //DEBUG
        draggedCarriage.cp = new Array();
        draggedCarriage.r = 0;
        draggedCarriage.c = new Point2D();
          
		evt.onMouseMove = function (ev) {
        	x = ev.stageX + offset.x;
            y = ev.stageY + offset.y;
            
            draggedCarriage.moveWithMagnetism(x,y);
        };
		
		evt.onMouseUp = function (ev) {
			setDirty();
			
			if (draggedCarriage.bogieFrontMagnetism.snapped) {
				var c = new Point2D(
					draggedCarriage.x + draggedCarriage.regX,
					draggedCarriage.y + draggedCarriage.regY);
				
				var r = c.distanceFrom( new Point2D(
					draggedCarriage.x+draggedCarriage.bogieBackdx,
					draggedCarriage.y+draggedCarriage.bogieBackdy) );
				
				draggedCarriage.r = r;
				draggedCarriage.c = c;
				
				//Get intersection between the segment and the circle describing the radius of the 
				if (draggedCarriage.bogieFrontMagnetism.segment.type == "LINE") {
					var a1 = draggedCarriage.bogieFrontMagnetism.segment.getStartPoint();
					var a2 = draggedCarriage.bogieFrontMagnetism.segment.getEndPoint();
					
					a1.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					a2.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					
					var candidatePoints = Intersection.intersectCircleLine(c, r, a1, a2);
				}
				
				if (draggedCarriage.bogieFrontMagnetism.segment.type == "BEZIER") {
					var p1 = draggedCarriage.bogieFrontMagnetism.segment.getStartPoint();
					var p2 = draggedCarriage.bogieFrontMagnetism.segment.cp1;
					var p3 = draggedCarriage.bogieFrontMagnetism.segment.cp2;
					var p4 = draggedCarriage.bogieFrontMagnetism.segment.getEndPoint();
					
					
					p1.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p2.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p3.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p4.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
										
					var candidatePoints = Intersection.intersectBezier3Circle(p1, p2, p3, p4, c, r);
				}
				
				if (candidatePoints.status = "Intersection") {
					draggedCarriage.cp = candidatePoints.points;
					var possibleRotation = draggedCarriage.getAngle(
							candidatePoints.points[0],
							new Point2D(draggedCarriage.x+draggedCarriage.bogieBackdx,
										draggedCarriage.y+draggedCarriage.bogieBackdy));
										
					possibleRotation = possibleRotation - draggedCarriage.originalAngle;
					draggedCarriage.originalAngle = draggedCarriage.rotation;
										
					console.log(possibleRotation);
					draggedCarriage.makeShape();
					
					/*
					redirectTickerToStage(true);
					
					var tween = Tween.get(draggedCarriage).to({rotation: possibleRotation-180-draggedCarriage.originalAngle}, 400, Transition.ease.out(Transition.bounce)).call(redirectTickerToStage,[false]);
					*/
				};
			
			}
		};
	}
	
	Carriage.prototype.move = function(x,y) {
		this.x = x;
		this.y = y;
		setDirty();		
	}
	
	Carriage.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    Carriage.prototype.moveWithMagnetism = function(x,y) {
    
    	console.log("x="+x+" -- y="+y);
    	
    	this.bogieFrontMagnetism = null;
    	this.bogieFrontMagnetism = this.bogieFront.moveWithMagnetism(
    		x  , 
    		y );
    	
    	this.move(	this.bogieFrontMagnetism.point.x , 
    				this.bogieFrontMagnetism.point.y );
    				
    	this.makeShape();
    }
    
    Carriage.prototype.start = function(connector) {
    	this.makeShape();
     }
    
   	Carriage.prototype.tick = function() {
   		
   	}
   	
   	Carriage.prototype.getAngle = function (origin, target) {
   		
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
   	
   		
    window.Carriage = Carriage;
}(window));