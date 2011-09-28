(function (window) {

    function Track() {    	
        this.initialize();
    }

    Track.prototype = new Container();
    Track.prototype.Container_initialize = Track.prototype.initialize; //unique to avoid overriding base class
    
    // constructor:
    Track.prototype.initialize = function () {
    	this.type = "Track";

        this.Container_initialize();
        this.connectors = new Array();
        this.scaleX = this.scaleY = this.scale = 1;
        this.vertex = null;
        this.selected = false;
        this.segments = new Array();
        this.switches = new Array();
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
        
        for (var i=0; i<this.segments.length; i++) {  
        	this.segments[i].move(x,y);
        } 
    }
    
    Track.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    Track.prototype.moveWithSelection = function(x,y) {
    	var dx = x - this.x;
    	var dy = y - this.y;
    	
    	railroad.selection.move(dx, dy);
    }

    Track.prototype.rotate = function (angle) { 
    	this.rotation = angle;
        
        var pivotPoint = new Point2D(this.x, this.y);
        
        for (var element in this.connectors) {
            this.connectors[element].rotate(angle, pivotPoint);
        };
              
        for (var i=0; i<this.segments.length; i++) {  
        	this.segments[i].rotate(angle, pivotPoint);
        } 
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
    
    Track.prototype.addSegment = function (segment) {
    	this.segments.push(segment);
    }
    
    Track.prototype.getSegmentTo = function(connector) {
    	var possibleSegments = new Array();
   	
    	for (var i=0; i<this.segments.length; i++) {
    		if ((this.segments[i].connectorA == connector)||(this.segments[i].connectorB == connector)){
    			possibleSegments.push(this.segments[i]);
    		}
      	}
      	
      	if (possibleSegments.length == 0) {
      		console.error("Track.prototype.getSegmentTo : connector without any segment");
      		return; 
      	}
      	
      	//Not a switch
		if (possibleSegments.length == 1) {
			return possibleSegments[0]; 
		} 
		     	
      	//If we have multiple segments, we need to check the switch position
      	var currentSwitchConnectorTarget = this.switches[connector].getCurrentTarget();
      
      	for (var j=0; j<possibleSegments.length; j++) {
      		if (possibleSegments[j].hasConnectors(connector,currentSwitchConnectorTarget)) return possibleSegments[j];
      	}
      	
      	console.error("Track.prototype.getSegmentTo : segment not found");
    }
    
    Track.prototype.getAllPoints = function(  ) {    	
    	var points = new Array();
    	for (var segmentIndex in this.segments) {
    		var segment = this.segments[segmentIndex];
    		
    		points = segment.getPoints(points);
    	}    	    	
    	return points;
    }
    
    Track.prototype.addSwitch = function( source, connectorsArray, position ) {
    	this.switches[ source ] = new Switch( connectorsArray, position );
    }
    

    window.Track = Track;
}(window));