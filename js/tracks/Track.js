(function (window) {

    function Track(name) {
    	//FIXME : we should use a model here
    	this.config = library.getTrackConfig(name);    	
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
        this.renderingContext = config.defaultTemplate;
        
        //Connectors
        for (var connectorNumber in this.config.connectors) {
        	var connector = new Connector(this, this.config.connectors[connectorNumber].type, 
        										this.config.connectors[connectorNumber].p1, 
        										this.config.connectors[connectorNumber].p2);
        										
        	this.connectors[this.config.connectors[connectorNumber].name] = connector;
        }
        
        //Switches
        for (var switchNumber in this.config.switches) {
        
        	var switchesConnectorArray = new Array();
        	
        	for (var switchesConnectorNumber in this.config.switches[switchNumber].connectorsArray) {
        		switchesConnectorArray.push(this.connectors[this.config.switches[switchNumber].connectorsArray[switchesConnectorNumber]]);
        	}
        	
        	this.addSwitch( this.config.switches[switchNumber].source, switchesConnectorArray, parseInt(this.config.switches[switchNumber].position));  
        }
        
        //Segments
        for (var segmentNumber in this.config.segments) {
        	
        	var p1 = undefined;
        	var p2 = undefined;
        	
        	if (this.config.segments[segmentNumber].cp1) {
        	
        		p1 = new Point2D(   parseFloat(this.config.segments[segmentNumber].cp1.x),
        	 						parseFloat(this.config.segments[segmentNumber].cp1.y));
        	}
        	
        	if (this.config.segments[segmentNumber].cp2) {
        	 						
				p2 = new Point2D(   parseFloat(this.config.segments[segmentNumber].cp2.x),
        	 						parseFloat(this.config.segments[segmentNumber].cp2.y));        	 						
        	}
        	
        	this.addSegment( new Segment(
        	 	this.config.segments[segmentNumber].type,
        	 	this.connectors[this.config.segments[segmentNumber].connectorA],
        	 	this.connectors[this.config.segments[segmentNumber].connectorB],
        	 	p1,
        	 	p2
        	 	 ));
        }
        

        //Pivot Point
        this.regX = parseFloat(this.config.regX);
        this.regY = parseFloat(this.config.regY);
        
        this.influence = parseFloat(this.config.influence); //the "magnet" influence radius of the track
        
        for (var element in this.connectors)	{	
			this.connectors[element].setRegistrationPoint(this.regX, this.regY);
		};
		
		for (var element in this.segments)	{	
			this.segments[element].setRegistrationPoint(this.regX, this.regY);
		};
		
        this.trackShape = new Shape();
        this.trackShape.snapToPixel = true;

        this.trackPivot = new Shape();
        this.trackPivot.snapToPixel = true;
        
        this.addChild(this.trackShape);
        this.addChild(this.trackPivot);
        
        if (debug.showids) {
        	this.trackText = new Text();
        	this.trackText.text = this.id;
        	this.trackText.x = this.regX;
        	this.trackText.y = this.regY;
        	this.addChild(this.trackText);
        }

        this.makeShape();
    }
    
    Track.prototype.setRenderingContext = function(context) {
    	this.renderingContext = context;
    	this.makeShape();
    
    }
    
    Track.prototype.getCoord = function() {
    	return new Point2D(this.x, this.y);
    }

    Track.prototype.onPress = function (evt) {
    
    	railroad.save();
    
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
    
    Track.prototype.setColor = function (newColor) {
        this.color = newColor;
        this.makeShape();
    },
    
    Track.prototype.getFillColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackFill;
    	if (this.renderingContext ==  config.smallTemplate) return colors.smallTemplateTrackFill;
    	if (this.color === undefined) 	return colors.defaultTrackFill;
    	return this.color;
    }
    
    Track.prototype.getStrokeColor = function() {
    	if (this.selected) 				return colors.defaultSelectedTrackStroke;
    	return colors.defaultTrackStroke;
    }
    
    
    Track.prototype.getStrokeWidth = function() {
    	return config.defaultTrackStroke;
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
    
    Track.prototype.makeShape = function () {
		//Track Shape
        var g = this.trackShape.graphics;
        g.clear();
        
        
        var operation;
        for (var opNumber in this.config.graphics) {
        
        	operation = this.config.graphics[opNumber];
        	switch (operation.op) {
        		case "line":
        			g.lineTo(operation.x, operation.y);
        			break;
        		case "bezier":
        			g.bezierCurveTo(operation.cp1x, operation.cp1y, operation.cp2x, operation.cp2y, operation.x, operation.y);
        			break;
        		case "move":
        			g.moveTo(operation.x, operation.y);
        			break;
        		case "startStroke":
        			g.setStrokeStyle(this.getStrokeWidth());
        			g.beginStroke(this.getStrokeColor());
        			break;
        		case "startFill":
        			g.beginFill(this.getFillColor());
        			break;
        		default:
        			console.error("Track.prototype.makeShape : unknown operation : "+operation.op);
        	}
        }
        setDirty();
    }
    
    Track.prototype.serialize = function () {
    	var serialized = new Object();
    	
    	serialized.x = this.x;
    	serialized.y = this.y;
    	serialized.name = this.config.name;
    	serialized.rotation = this.rotation;
    	
    	return serialized;
    }

    window.Track = Track;
}(window));