(function (window) {

    function Track() {    	
        this.initialize();
    }

    Track.prototype = new Container();
    Track.prototype.Container_initialize = Track.prototype.initialize; //unique to avoid overiding base class
    
    // constructor:
    Track.prototype.initialize = function () {
    	this.type = "Track";

        this.Container_initialize();
        this.connectors = new Array();
        this.previousCoord = new Point2D(0, 0);
        this.scaleX = this.scaleY = this.scale = 1;
        this.vertex = null;
        this.selected = false;
    }
    
    Track.prototype.getCoord = function() {
    	return new Point2D(this.x, this.y);
    }

    Track.prototype.onPress = function (evt) {
    
        var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var rootTrack = this; //The dragged element.
        
        railroad.selection.reset();
        
        // are we selecting the whole connected block ?
        if (!evt.nativeEvent.shiftKey) {
       		// find all the tracks belonging to this subgraph 
        	var dps = new DepthFirstSearch(railroad.graph.getVertices(), this.vertex);
        	
			for (var t in dps.preorder) {
				railroad.selection.add( railroad.tracks[dps.preorder[t]] ); 
			}  					      	        	
        }  else {
        	railroad.selection.add(this);
        }
        
        railroad.showRotationDial( railroad.selection );
        railroad.startDrag();

        // add a handler to the event object's onMouseMove callback
        // this will be active until the user releases the mouse button:
        evt.onMouseMove = function (ev) {
        	
        	railroad.hideRotationDial();
        
            x = ev.stageX + offset.x;
            y = ev.stageY + offset.y;
           
           	//FIXME : not really nice.
            rootTrack.moveWithSelection(x, y);
            railroad.startMagnetism();

            // indicate that the stage should be updated on the next tick:
            setDirty();
        };
        
        evt.onMouseUp = function (ev) {
        	railroad.endDrag();
        }
    }

    Track.prototype.onMouseOver = function () {
        setDirty();
    }

    Track.prototype.onMouseOut = function () {
        setDirty();
    }

    Track.prototype.move = function (x, y) {
		this.x = x;
        this.y = y;
	
        for (var element in this.connectors) {
            this.connectors[element].move(x, y);
        };  
    }
    
    Track.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    Track.prototype.moveWithSelection = function(x,y) {
    	var dx = x - this.x;
    	var dy = y - this.y;
    	
    	railroad.selection.move(dx, dy);
    }

    Track.prototype.rotate = function (angle) { //relative by default
        this.rotation = angle;
        var pivotPoint = new Point2D(this.x, this.y);
        for (var element in this.connectors) {
            this.connectors[element].rotate(angle, pivotPoint);
        };
    }
    
    Track.prototype.getFillColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackFill;
    	if (this.color === undefined) 	return colors.defaultTrackFill;
    	return this.color;
    }
    
    Track.prototype.getStrokeColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackStroke;
    	return colors.defaultTrackStroke;
    }
    
    Track.prototype.resetConnections = function() {
    	for (var element in this.connectors) {
    		this.connectors[element].resetConnection();
    	}  
    }
    
    Track.prototype.setSelection = function(value) {
    	if (value != this.selected) {
    		this.selected = value;
    		this.makeShape();
    	}
    }
    
    Track.prototype.getPoints = function( pathName ) {
    	var points = new Array();
    	
    	for (var connector in this.connectors) {
    		for (var path in this.connectors[connector].paths) {
    			if ( (pathName === undefined) || (pathName == this.connectors[connector].paths[path].name)){
    				
    				var segment = this.connectors[connector].paths[path].segment;
    				var target  = this.connectors[connector].paths[path].target;
    				var startPoint = this.connectors[connector].getCenter();
    				var endPoint   = target.getCenter();
    				
    				var discreetPath = new Path();
    				
    				if (segment.type == "BEZIER") {
    					discreetPath.addBezier([ 	startPoint,
    									 			segment.cp1,
    									 			segment.cp2,
    									 			endPoint ]);
    				}
    				
    				if (segment.type == "LINE") {
    					discreetPath.addLine(	startPoint,
    											endPoint );
    				
    				}
    				
    				for (var i=0; i<100; i += (100/config.pathPrecision)) {
    					points.push(discreetPath.atT(i/100));
    				}
    			}
    		}
    	}
    	    	    	
    	return points;
    }
    
    Track.prototype.getAllPoints = function () {
    	return this.getPoints();
    }

    window.Track = Track;
}(window));