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
        
        //this.car.regX = 10;
        //this.car.regY = 10;
        
        this.makeShape();
        this.addChild(this.car);
        
        this.snappedPoint = new Point2D();
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
    				}
    			}
    		}
    		
    	}
    	
    	//this.move(x,y);
    	this.move(targetPoint.point.x,targetPoint.point.y);
    	this.makeShape();
    }

    window.Car = Car;
}(window));