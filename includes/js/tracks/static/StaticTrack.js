(function (window) {

    function StaticTrack() {    	
        this.initialize();
    }

    StaticTrack.prototype = new Container();
    StaticTrack.prototype.Container_initialize = StaticTrack.prototype.initialize; //unique to avoid overriding base class
    
    // constructor:
    StaticTrack.prototype.initialize = function () {
    	this.type = "Track";

        this.Container_initialize();
        this.connectors = new Array();
        this.scaleX = this.scaleY = this.scale = 1;
        this.vertex = null;
        this.selected = false;
        this.segments = new Array();
        this.switches = new Array();
    }
    
    StaticTrack.prototype.getCoord = function() {
    	return new Point2D(this.x, this.y);
    }

    StaticTrack.prototype.onPress = function (evt) {
    
        var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var rootTrack = this; //The dragged element.
        
        railway.selection.reset();
        
        // are we selecting the whole connected block ?
        if (!evt.nativeEvent.shiftKey) {
       		// find all the tracks belonging to this subgraph 
        	var dps = new DepthFirstSearch(railway.graph.getVertices(), this.vertex);
        	
			for (var t in dps.preorder) {
				railway.selection.add( railway.tracks[dps.preorder[t]] ); 
			}  					      	        	
        }  else {
        	railway.selection.add(this);
        }
        
        railway.showRotationDial( railway.selection );
        railway.startDrag();

        // add a handler to the event object's onMouseMove callback
        // this will be active until the user releases the mouse button:
        evt.onMouseMove = function (ev) {
        	
        	railway.hideRotationDial();
        
            x = ev.stageX + offset.x;
            y = ev.stageY + offset.y;
           
           	//FIXME : not really nice.
            rootTrack.moveWithSelection(x, y);
            railway.startMagnetism();

            // indicate that the stage should be updated on the next tick:
            setDirty();
        };
        
        evt.onMouseUp = function (ev) {
        	railway.endDrag();
        }
    }

    StaticTrack.prototype.onMouseOver = function () {
        setDirty();
    }

    StaticTrack.prototype.onMouseOut = function () {
        setDirty();
    }

    StaticTrack.prototype.move = function (x, y) {
		this.x = x;
        this.y = y;
	
        for (var element in this.connectors) {
            this.connectors[element].move(x, y);
        };  
        
        for (var i=0; i<this.segments.length; i++) {  
        	this.segments[i].move(x,y);
        } 
    }
    
    StaticTrack.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    StaticTrack.prototype.moveWithSelection = function(x,y) {
    	var dx = x - this.x;
    	var dy = y - this.y;
    	
    	railway.selection.move(dx, dy);
    }

    StaticTrack.prototype.rotate = function (angle) { 
    	this.rotation = angle;
        
        var pivotPoint = new Point2D(this.x, this.y);
        
        for (var element in this.connectors) {
            this.connectors[element].rotate(angle, pivotPoint);
        };
              
        for (var i=0; i<this.segments.length; i++) {  
        	this.segments[i].rotate(angle, pivotPoint);
        } 
    }
    
    StaticTrack.prototype.getFillColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackFill;
    	if (this.color === undefined) 	return colors.defaultTrackFill;
    	return this.color;
    }
    
    StaticTrack.prototype.getStrokeColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackStroke;
    	return colors.defaultTrackStroke;
    }
    
    StaticTrack.prototype.resetConnections = function() {
    	for (var element in this.connectors) {
    		this.connectors[element].resetConnection();
    	}  
    }
    
    StaticTrack.prototype.setSelection = function(value) {
    	if (value != this.selected) {
    		this.selected = value;
    		this.makeShape();
    	}
    }
    
    StaticTrack.prototype.addSegment = function (segment) {
    	this.segments.push(segment);
    }
    
    StaticTrack.prototype.getSegmentTo = function(connector) {
    	var possibleSegments = new Array();
   	
    	for (var i=0; i<this.segments.length; i++) {
    		if ((this.segments[i].connectorA == connector)||(this.segments[i].connectorB == connector)){
    			possibleSegments.push(this.segments[i]);
    		}
      	}
      	
      	if (possibleSegments.length == 0) {
      		console.error("StaticTrack.prototype.getSegmentTo : connector without any segment");
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
      	
      	console.error("StaticTrack.prototype.getSegmentTo : segment not found");
    }
    
    StaticTrack.prototype.getAllPoints = function(  ) {    	
    	var points = new Array();
    	for (var segmentIndex in this.segments) {
    		var segment = this.segments[segmentIndex];
    		
    		points = segment.getPoints(points);
    	}    	    	
    	return points;
    }
    
    StaticTrack.prototype.addSwitch = function( source, connectorsArray, position ) {
    	this.switches[ source ] = new Switch( connectorsArray, position );
    }
    

    window.StaticTrack = StaticTrack;
}(window));