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
    }

    Carriage.prototype.makeShape = function () {
        var g = this.carriage.graphics;

        g.clear();
        g.setStrokeStyle(1);
        g.beginStroke(colors.carriageStroke);
        g.beginFill(colors.carriageFill);
        g.drawRect(0, 0, 100, 30);
         
        setDirty();
    }
       Carriage.prototype.onPress = function (evt) { 
    
    	railroad.hideRotationDial();
    	railroad.forwardArrow.hide();
		railroad.backwardArrow.hide();
		
    	var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var draggedCarriage = this; //The dragged element.
          
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
					var p2 = draggedCarriage.bogieFrontMagnetism.segment.cp1.clone();
					var p3 = draggedCarriage.bogieFrontMagnetism.segment.cp2.clone();
					var p4 = draggedCarriage.bogieFrontMagnetism.segment.getEndPoint();
					
					
					p1.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p2.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p3.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
					p4.rmoveto(draggedCarriage.regX, draggedCarriage.regY);
										
					var candidatePoints = Intersection.intersectBezier3Circle(p1, p2, p3, p4, c, r);
				}
				
				if ((candidatePoints.status = "Intersection")&&(candidatePoints.points.length >0)) {
					//TODO : Find the "best" snapping point for the back of the carriage
					
					var underScrutinyPoint = new Point2D();
					var electedPoint = null;
	
					for (var p in candidatePoints.points) {
						
						underScrutinyPoint.x = candidatePoints.points[p].x;
						underScrutinyPoint.y = candidatePoints.points[p].y;
						/*
						if (underScrutinyPoint.closeTo (new Point2D(draggedCarriage.x+draggedCarriage.bogieBackdx,
																	draggedCarriage.y+draggedCarriage.bogieBackdy), 5)) {
							//remove point
							var idx = candidatePoints.points.indexOf(candidatePoints.points[p]); // Find the index
							if(idx!=-1) candidatePoints.points.splice(idx, 1); // Remove it if really found!
						} else {
							electedPoint = underScrutinyPoint.clone();
						}
						*/
						electedPoint =  underScrutinyPoint.clone();
					}	
					
					draggedCarriage.cp = candidatePoints.points;
					
					if (electedPoint) {
						var previousPositionPoint = new Point2D(draggedCarriage.x+draggedCarriage.bogieBackdx,
						draggedCarriage.y+draggedCarriage.bogieBackdy);
						
						var pivotPoint = new Point2D(draggedCarriage.x+draggedCarriage.bogieFrontdx,
						draggedCarriage.y+draggedCarriage.bogieFrontdy);
						
						var possibleRotation = pivotPoint.getAngle(previousPositionPoint,electedPoint);
																					
					}
					draggedCarriage.makeShape();
				
					redirectTickerToStage(true);
					
					//FIXME : why do  we have to add 180 ?
					var tween = Tween.get(draggedCarriage).to({rotation: possibleRotation + 180}, 400, Transition.ease.out(Transition.bounce)).call(redirectTickerToStage,[false]);
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
   		
    window.Carriage = Carriage;
}(window));