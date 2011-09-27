(function (window) {

    function MapView(originalGrid, zoomFactor) {
    	this.type = "MapView";
    
    	this.zoomFactor = zoomFactor;
    
        this.width  = originalGrid.width  * zoomFactor;
        this.height = originalGrid.height * zoomFactor;
        
        this.gridWidth  = originalGrid.width;
        this.gridHeight = originalGrid.height;

        this.initialize();
    }

    MapView.prototype = new Container();
    MapView.prototype.Container_initialize = MapView.prototype.initialize; //unique to avoid overriding base class
    // constructor:
    MapView.prototype.initialize = function () {
        this.Container_initialize();

        this.map = new Shape();

        this.map.snapToPixel = true;
        
        this.map.scaleX = this.zoomFactor;
        this.map.scaleY = this.zoomFactor;
        
        this.map.height = this.height;
        this.map.width = this.width;
        
        this.map.regX   = this.width / 2;
        this.map.regY   = this.height / 2

        this.addChild(this.map);
    }

    MapView.prototype.makeShape = function () {
        var g = this.map.graphics;

        g.clear();
        g.beginFill(colors.mapViewBackground).setStrokeStyle(1/this.zoomFactor).beginStroke("#000");
        g.rect(0, 0, this.width / this.zoomFactor, this.height / this.zoomFactor).endFill();

        for (var track in railroad.tracks) {
            this.drawPath(railroad.tracks[track], g);
        }
        
        g.endFill();
        
        g.beginFill(colors.mapViewViewport).setStrokeStyle(1/this.zoomFactor).beginStroke("#000");
        
        //TODO : remove dependancy to global backgroundGrid
        var x = backgroundGrid.width/2 - backgroundGrid.x;
        var y = backgroundGrid.height/2 - backgroundGrid.y;
        
        var height = window.innerHeight;
        var width  = window.innerWidth;

        g.rect(x,y,width,height);
        g.endFill();
    }
    
    MapView.prototype.refresh = function() {
    	this.makeShape();
    }

    MapView.prototype.drawPath = function (track, graphics) {

        for (var segmentIndex in track.segments) {
        	var c1 = backgroundGrid.absolutizePoint ( track.segments[segmentIndex].connectorA.getCenter() );
            var c2 = backgroundGrid.absolutizePoint ( track.segments[segmentIndex].connectorB.getCenter() );

            graphics.endFill().setStrokeStyle(5/this.zoomFactor).beginStroke("#000");

            if (track.segments[segmentIndex].type == "LINE") {
            	graphics.moveTo(c1.x, c1.y).lineTo(c2.x, c2.y).closePath();
            } else {
				cp1 = backgroundGrid.absolutizePoint ( track.segments[segmentIndex].cp1 );
                cp2 = backgroundGrid.absolutizePoint ( track.segments[segmentIndex].cp2 );

                graphics.moveTo(c1.x, c1.y).bezierCurveTo(
	                    cp1.x, 
	                    cp1.y, 
	                    cp2.x, 
	                    cp2.y, 
	                    c2.x, 
	                    c2.y);
            }
		}
		
		for (var connector in track.connectors) {
            //Draw connectors
            graphics.endFill().setStrokeStyle(1/this.zoomFactor).beginStroke("#000");
            
            var p1 = backgroundGrid.absolutizePoint ( track.connectors[connector].p1 );
            var p2 = backgroundGrid.absolutizePoint ( track.connectors[connector].p2 );

            graphics.moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).closePath();
        }
    }
    
    MapView.prototype.onPress = function (evt) {       
		evt.onMouseMove = function (evt) {
        		
        };
		
		evt.onMouseUp = function (evt) {
					
		};
	}

    window.MapView = MapView;
}(window));