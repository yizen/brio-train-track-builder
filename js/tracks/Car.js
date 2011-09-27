(function (window) {

    function Car() {
    	this.type = "Car";
    
    	this.initialize();
    }

    Car.prototype = new Container();
    Car.prototype.Container_initialize = Car.prototype.initialize; //unique to avoid overriding base class
    // constructor:
    Car.prototype.initialize = function () {
        this.Container_initialize();

        this.car = new Shape();
        this.car.snapToPixel = true;
        
        this.makeShape();
        this.addChild(this.car);
        
        this.snappedPoint = new Point2D();
 		this.snappedSegment = new Object();
        this.snapped = false;
        this.targetConnector = null;
        
        this.pointsInPath = new Array();
		this.indexInPath = 0;
		this.moving = false;
    }

    Car.prototype.makeShape = function () {
        var g = this.car.graphics;

        g.clear();
        this.moving ? g.beginFill(colors.carMoving) : g.beginFill(colors.carMagnetPoint);
        g.drawCircle(0, 0, 20);
        g.endFill();
        
        if (this.snapped) {
        	g.beginFill("#FF00FF");
        	g.drawCircle(this.snappedPoint.x- this.x, this.snappedPoint.y-this.y, 2);
        	g.endFill();
        }
        
        setDirty();
    }
    
    Car.prototype.onPress = function (evt) { 
    
    	railroad.hideRotationDial();
    
    	railroad.forwardArrow.hide();
		railroad.backwardArrow.hide();

    	var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var draggedCar = this; //The dragged element.
          
		evt.onMouseMove = function (ev) {
        	x = ev.stageX + offset.x;
            y = ev.stageY + offset.y;
            
            draggedCar.moveWithMagnetism(x,y);
        };
		
		evt.onMouseUp = function (ev) {
			if (!draggedCar.snapped) return;
						
			//init arrows
			railroad.forwardArrow.targetConnector  = draggedCar.snappedSegment.connectorA;
			railroad.backwardArrow.targetConnector = draggedCar.snappedSegment.connectorB;
			railroad.forwardArrow.car  = draggedCar;
			railroad.backwardArrow.car = draggedCar;
			
			//TODO : Check if we're at the beginning or the end of a track, 
			//       and if this is the case evaluate if we have another track connected
			//       or if we're pointing to the void
			
			//display arrows
			railroad.forwardArrow.x  = draggedCar.x;
			railroad.backwardArrow.x = draggedCar.x;
			
			railroad.forwardArrow.y  = draggedCar.y-40;
			railroad.backwardArrow.y = draggedCar.y-40;
			
			//Calculate direction
			var forwardTarget  = railroad.forwardArrow.targetConnector.getCenter();
			var backwardTarget = railroad.backwardArrow.targetConnector.getCenter();
			
			var forwardAngle = railroad.forwardArrow.getAngle(
				new Point2D(draggedCar.x, draggedCar.y), 
				new Point2D(railroad.forwardArrow.x, railroad.forwardArrow.y),
				new Point2D(forwardTarget.x, forwardTarget.y)
			);
			
			//FIXME : something must be wrong somewhere, we shouldn't have to substract 180.
			railroad.forwardArrow.rotation = forwardAngle - 180;
			
			var newForwardArrowPosition = new Point2D(railroad.forwardArrow.x, railroad.forwardArrow.y);
			newForwardArrowPosition.rotate(railroad.forwardArrow.rotation, new Point2D(draggedCar.x, draggedCar.y));
			
			railroad.forwardArrow.x = newForwardArrowPosition.x;
			railroad.forwardArrow.y = newForwardArrowPosition.y;
			
			
			var backwardAngle = railroad.backwardArrow.getAngle(
				new Point2D(draggedCar.x, draggedCar.y), 
				new Point2D(railroad.backwardArrow.x, railroad.backwardArrow.y),
				new Point2D(backwardTarget.x, backwardTarget.y)
			);
			
			//FIXME : something must be wrong somewhere, we shouldn't have to substract 180.
			railroad.backwardArrow.rotation = backwardAngle - 180;
			
			var newBackwardArrowPosition = new Point2D(railroad.backwardArrow.x, railroad.backwardArrow.y);
			newBackwardArrowPosition.rotate(railroad.backwardArrow.rotation, new Point2D(draggedCar.x, draggedCar.y));
			
			railroad.backwardArrow.x = newBackwardArrowPosition.x;
			railroad.backwardArrow.y = newBackwardArrowPosition.y;
			
			railroad.forwardArrow.show();
			railroad.backwardArrow.show();
			
			setDirty();
		};
	}
	
	Car.prototype.move = function(x,y) {
		//this.makeShape();
		this.x = x;
		this.y = y;
		setDirty();		
	}
	
	Car.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    Car.prototype.moveWithMagnetism = function(x,y) {
    	this.snapped = false;
    
    	var targetPoint = new Object();
    	targetPoint.distance = Number.MAX_VALUE;
    	targetPoint.point = new Point2D(x,y);
    	
    	var objectsUnderPoint = stage.getObjectsUnderPoint(x,y);
    	
    	for (var obj in objectsUnderPoint) {
    	    var objectType     = objectsUnderPoint[obj].type;
    		var objectPointer  = objectsUnderPoint[obj];
    		
    		if (objectType === undefined) {
    			objectType = objectsUnderPoint[obj].parent.type;
    			objectPointer  = objectsUnderPoint[obj].parent;
    		}
    		
    		if (objectType == "Track") {
    			points = objectPointer.getAllPoints();

    			for (var p in points) {
    				
    				var candidatePoint = new Point2D(points[p].x, points[p].y);
    				var calculatedDistance = candidatePoint.distanceFrom(new Point2D(x,y));
    				
    				if (targetPoint.distance > calculatedDistance) {
    					targetPoint.distance = calculatedDistance;
    					targetPoint.point = candidatePoint;
    					this.snapped = true;
    					this.snappedPoint = candidatePoint;
    					this.snappedSegment = points[p].segment;
    					this.snappedPosition = points[p].position; 
    				}
    			}
    		}
    		
    	}
    	
    	this.move(targetPoint.point.x,targetPoint.point.y);
    	this.makeShape();
    }
    
    Car.prototype.start = function(connector) {
    	if (!this.snapped) {
    		console.error("Car.prototype.start : CAR NOT SNAPPED CANNOT START");
    		return;
    	}
    	
    	this.pointsInPath = new Array();
    	this.indexInPath  = this.snappedPosition;
    	this.targetConnector = connector;
    	
    	if (connector == this.snappedSegment.connectorB) {
    		console.log("STARTED : GOING TO CONNECTOR B");
    		this.pointsInPath = this.snappedSegment.getPoints(this.pointsInPath);
    	}
    	
    	if (connector == this.snappedSegment.connectorA) {
    		console.log("STARTED : GOING TO CONNECTOR A");
    		this.pointsInPath = this.snappedSegment.getPoints(this.pointsInPath, true);
    		this.indexInPath = (100/config.pathPrecision) - this.indexInPath ;
    	}
    	
    	console.log("------- "+this.indexInPath+" --------");
    	
    	this.moving = true;
    	this.makeShape();
     }
    
   	Car.prototype.tick = function() {
   		if (!this.moving) return;
		//   	var c = this;
		//   	carIntervalId = window.setInterval(c.step(), config.speed);
		this.step();
   	}
	
	Car.prototype.step = function() {
		console.log("CURRENT STEP :"+this.indexInPath+" ON TRACK NUMBER "+this.targetConnector.track.id);
		if (this.indexInPath >= (100/config.pathPrecision)-1) {
			this.moving = false;
			console.log("END OF TRACK");
			//window.clearInterval(carIntervalId);
			this.snappedPoint = new Point2D(this.x, this.y);
			
			if (this.targetConnector.edge != null) {
				console.log("MOVING ON TO TRACK "+this.targetConnector.edge.track.id);
				this.requestNextTrack();
			} else {
				console.log("NOWHERE ELSE TO GO : STOP");
				console.log("-------------------------");
				
				//FIXME : this confusing : we need to isolate the "end of movement" and "snapping" logic.
				if (this.targetConnector == this.snappedSegment.connectorA) {	
					this.snappedPosition = 0;
				} else {
					this.snappedPosition = 10;
				}
				
				this.makeShape();
			}
		} else {
			this.indexInPath++;		
			this.move(this.pointsInPath[this.indexInPath].x, this.pointsInPath[this.indexInPath].y);
		}
	}
	
	Car.prototype.requestNextTrack = function() {
		var targetTrack = this.targetConnector.edge.track;
		this.snappedSegment  = targetTrack.getSegmentTo( this.targetConnector.edge);
		
		if (this.targetConnector.edge == this.snappedSegment.connectorA) {
			console.log("CONNECTION : GOING TO CONNECTOR B OF TRACK "+this.targetConnector.edge.track.id);
			this.snappedPosition = 0;
			this.start( this.snappedSegment.connectorB );
		}
		
		if (this.targetConnector.edge == this.snappedSegment.connectorB) {
			console.log("CONNECTION : GOING TO CONNECTOR A OF TRACK "+this.targetConnector.edge.track.id);
			this.snappedPosition = (100/config.pathPrecision);
			this.start( this.snappedSegment.connectorA );
		}
	}
	
    window.Car = Car;
}(window));