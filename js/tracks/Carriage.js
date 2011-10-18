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
        this.moving  = false;
    }

    Carriage.prototype.makeShape = function () {
        var g = this.carriage.graphics;

        g.clear();
        g.beginFill(colors.carriageFill);
        g.drawRect(0, 0, 100, 30);
        g.drawCircle(0,15,15);
         
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

			draggedCarriage.snapped = false;
			
			//If we've snapped the front Bogie, let's try to snap the back Bogie
			if (draggedCarriage.bogieFrontMagnetism.snapped) {
				
				var electedPoint = draggedCarriage.snapBackBogie();	
				
				if (electedPoint) {
					//We at least know that we're snapped to a track
					draggedCarriage.snapped = true;
					
					var newRotation = draggedCarriage.getRotationToBackBogie(electedPoint);	
																								
					draggedCarriage.makeShape();
					
					draggedCarriage.showArrows();
					setDirty();
					
					redirectTickerToStage(true);
					var tween = Tween.get(draggedCarriage).to({rotation: newRotation}, 600, Transition.ease.out(Transition.bounce)).call(redirectTickerToStage,[false]);
				}
			}
		}
	};
	
	Carriage.prototype.snapBackBogie = function() {
	
		//Center of the intersection circle is the front bogie
		var c = new Point2D(
			this.x + this.regX,
			this.y + this.regY);
		
		//Radius of the intersection circle is the distance between fromt and back bogie
		var r = c.distanceFrom( new Point2D(
			this.x + this.bogieBackdx,
			this.y + this.bogieBackdy) );
		
		//Get intersection between the segment and the circle describing the radius of the 
		//distance bewtwee front or back 
		if (this.bogieFrontMagnetism.segment.type == "LINE") {
			var a1 = this.bogieFrontMagnetism.segment.getStartPoint();
			var a2 = this.bogieFrontMagnetism.segment.getEndPoint();
			
			a1.rmoveto(this.regX, this.regY);
			a2.rmoveto(this.regX, this.regY);
			
			var candidatePoints = Intersection.intersectCircleLine(c, r, a1, a2);
		}
		
		if (this.bogieFrontMagnetism.segment.type == "BEZIER") {
			var p1 = this.bogieFrontMagnetism.segment.getStartPoint();
			var p2 = this.bogieFrontMagnetism.segment.cp1.clone();
			var p3 = this.bogieFrontMagnetism.segment.cp2.clone();
			var p4 = this.bogieFrontMagnetism.segment.getEndPoint();
			
			
			p1.rmoveto(this.regX, this.regY);
			p2.rmoveto(this.regX, this.regY);
			p3.rmoveto(this.regX, this.regY);
			p4.rmoveto(this.regX, this.regY);
								
			var candidatePoints = Intersection.intersectBezier3Circle(p1, p2, p3, p4, c, r);
		}
		
		//If we have candidate Points let's try to find the "best"
		if ((candidatePoints.status = "Intersection")&&(candidatePoints.points.length >0)) {
			//Let's examine all points
			var underScrutinyPoint = new Point2D();
			var electedPoint = null;

			for (var p in candidatePoints.points) {
				
				underScrutinyPoint.x = candidatePoints.points[p].x;
				underScrutinyPoint.y = candidatePoints.points[p].y;
				
				//TODO: create the algorithm for detecting the best point.
				
				/*
				if (underScrutinyPoint.closeTo (new Point2D(this.x+this.bogieBackdx,
															this.y+this.bogieBackdy), 5)) {
					//remove point
					var idx = candidatePoints.points.indexOf(candidatePoints.points[p]); // Find the index
					if(idx!=-1) candidatePoints.points.splice(idx, 1); // Remove it if really found!
				} else {
					electedPoint = underScrutinyPoint.clone();
				}
				*/
				
				electedPoint =  underScrutinyPoint.clone();
			}
			
			//Snap it to its segment
			//FIXME: there should be a better way to find the current Track !
			this.bogieBack.snapToSegment(electedPoint,this.bogieFrontMagnetism.segment.connectorA.track);
			return electedPoint;	
			
		} 
		else 
		{
			return null;
		}
	}
	
	Carriage.prototype.getRotationToBackBogie = function(newPositionPoint) {
		
		if (newPositionPoint === undefined) {
			console.error("Carriage.prototype.getRotationToBackBogie : cannot rotate to undefined point");
			return 0;
		}
		
		var previousPositionPoint = new Point2D(this.x+this.bogieBackdx,
												this.y+this.bogieBackdy);
						
		var pivotPoint = new Point2D(this.x+this.bogieFrontdx,
									 this.y+this.bogieFrontdy);
						
		//FIXME: Why do we have to add 180 ?			
		return(pivotPoint.getAngle(previousPositionPoint,newPositionPoint)+180);
	}
	
	
	Carriage.prototype.showArrows = function () {
		//init arrows
		railroad.forwardArrow.targetConnector  =  this.bogieFront.snappedSegment.connectorA;
		railroad.backwardArrow.targetConnector =  this.bogieFront.snappedSegment.connectorB;
		railroad.forwardArrow.carriage  = this;
		railroad.backwardArrow.carriage = this;
		
		//TODO : Check if we're at the beginning or the end of a track, 
		//       and if this is the case evaluate if we have another track connected
		//       or if we're pointing to the void
		
		//display arrows
		railroad.forwardArrow.x  = this.x;
		railroad.backwardArrow.x = this.x;
		
		railroad.forwardArrow.y  = this.y-20;
		railroad.backwardArrow.y = this.y-20;
		
		//Calculate direction
		var forwardTarget  = railroad.forwardArrow.targetConnector.getCenter();
		var backwardTarget = railroad.backwardArrow.targetConnector.getCenter();
		
		var position = new Point2D(this.x, this.y);
		
		var forwardAngle = position.getAngle(
			new Point2D(railroad.forwardArrow.x, railroad.forwardArrow.y),
			new Point2D(forwardTarget.x, forwardTarget.y)
		);
		
		//FIXME : something must be wrong somewhere, we shouldn't have to substract 180.
		railroad.forwardArrow.rotation = forwardAngle - 180;
		
		var newForwardArrowPosition = new Point2D(railroad.forwardArrow.x, railroad.forwardArrow.y);
		newForwardArrowPosition.rotate(railroad.forwardArrow.rotation, new Point2D(this.x, this.y));
		
		railroad.forwardArrow.x = newForwardArrowPosition.x;
		railroad.forwardArrow.y = newForwardArrowPosition.y;
		
		
		var backwardAngle = position.getAngle(
			new Point2D(railroad.backwardArrow.x, railroad.backwardArrow.y),
			new Point2D(backwardTarget.x, backwardTarget.y)
		);
		
		//FIXME : something must be wrong somewhere, we shouldn't have to substract 180.
		railroad.backwardArrow.rotation = backwardAngle - 180;
		
		var newBackwardArrowPosition = new Point2D(railroad.backwardArrow.x, railroad.backwardArrow.y);
		newBackwardArrowPosition.rotate(railroad.backwardArrow.rotation, new Point2D(this.x, this.y));
		
		railroad.backwardArrow.x = newBackwardArrowPosition.x;
		railroad.backwardArrow.y = newBackwardArrowPosition.y;
		
		railroad.forwardArrow.show();
		railroad.backwardArrow.show();
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
    
    	if (!this.snapped) {
    		console.error("Carriage.prototype.start : cannot start an non snapped carriage");
    		return;
    	}
    
    	this.bogieFront.start(connector);
    	this.bogieBack.start(connector);
    	this.moving = true;
    }
    
   	Carriage.prototype.tick = function() {   	
   		if (!this.moving) return;
   		
   		var resultFront = this.bogieFront.step();
   		var resultBack  = this.bogieBack.step();
   		
   		//Are we still moving ?
   		if (resultFront.status == "STOPPED" || resultBack.status == "STOPPED") {
   			this.moving = false;
   			return;
   		}
   		
   		//Yes, so can we move ?
   		if (resultFront.status == "NEXTTRACK" || resultBack.status == "NEXTTRACK") {
   			//At lease on of the two bogie is changing track, so we'll way on next tick to know the next position
   			//TODO : we should move a little bit the carriage to show the passing of next track
   			return;
   		}
   		
   		//So we can move !
   		resultBack.point.rmoveto(this.regX, this.regY);
   		var rotation = this.getRotationToBackBogie(resultBack.point);
   		
   		this.rotation = rotation;
   		
   		this.move(resultFront.point.x, resultFront.point.y);

   		setDirty();
   	} 
   	
   	Carriage.prototype.stop = function() {
   		this.moving = false;
   	}  	
   		
    window.Carriage = Carriage;
}(window));