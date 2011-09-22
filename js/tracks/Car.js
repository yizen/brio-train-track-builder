(function (window) {

    function Car() {
    	this.type = "Car";
    
    	this.initialize();
    }

    Car.prototype = new Container();
    Car.prototype.Container_initialize = Car.prototype.initialize; //unique to avoid overiding base class
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
    }

    Car.prototype.makeShape = function () {
        var g = this.car.graphics;

        g.clear();
        g.beginFill(colors.carMagnetPoint);
        g.drawCircle(0, 0, 20);
        g.endFill();
        
        if (this.snapped) {
        	g.beginFill("#FFFFFF");
        	g.drawCircle(this.snappedPoint.x- this.x, this.snappedPoint.y-this.y, 2);
        	g.endFill();
        }
        
        setDirty();
    }
    
    Car.prototype.onPress = function (evt) { 
    
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
			
			//display arrows
			railroad.forwardArrow.x  = draggedCar.x;
			railroad.backwardArrow.x = draggedCar.x;
			
			railroad.forwardArrow.y  = draggedCar.y-40;
			railroad.backwardArrow.y = draggedCar.y-40;
			
			//Calculate direction
			var forwardTarget  = draggedCar.snappedSegment.connectorA.getCenter();
			var backwardTarget = draggedCar.snappedSegment.connectorB.getCenter();
			
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
    				}
    			}
    		}
    		
    	}
    	
    	this.move(targetPoint.point.x,targetPoint.point.y);
    	this.makeShape();
    }

    window.Car = Car;
}(window));