(function (window) {

    function MapView(originalGrid, zoomFactor) {
    
    	this.zoomFactor = zoomFactor;
    
        this.width  = originalGrid.width  * zoomFactor;
        this.height = originalGrid.height * zoomFactor;
        
        this.gridWidth  = originalGrid.width;
        this.gridHeight = originalGrid.height;

        this.initialize();
    }

    MapView.prototype = new Container();
    MapView.prototype.Container_initialize = MapView.prototype.initialize; //unique to avoid overiding base class
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
        g.beginFill(colors.mapViewBackground);
        g.setStrokeStyle(3);
        g.rect(0, 0, this.width / this.zoomFactor, this.height / this.zoomFactor).endFill();

        for (var track in railroad.tracks) {
            this.drawPath(railroad.tracks[track], g);
        }
    }
    
    MapView.prototype.refresh = function() {
    	this.makeShape();
    }

    MapView.prototype.drawPath = function (track, graphics) {

        for (var connector in track.connectors) {
            for (var i = 0; i < track.connectors[connector].path.length; i++) {
                c1 = this.absolutizePoint ( track.connectors[connector].getCenter() );
                c2 = this.absolutizePoint ( track.connectors[connector].path[i].target.getCenter() );

                graphics.endFill().setStrokeStyle(5).beginStroke("#000");

                if (track.connectors[connector].path[i].segment.type == "LINE") {
                    graphics.moveTo(c1.x, c1.y).lineTo(c2.x, c2.y).closePath();
                } else {
                
                	cp1 = this.absolutizePoint ( track.connectors[connector].path[i].segment.cp1 );
                	cp2 = this.absolutizePoint ( track.connectors[connector].path[i].segment.cp2 );

                    graphics.moveTo(c1.x, c1.y).bezierCurveTo(
	                    cp1.x, 
	                    cp1.y, 
	                    cp2.x, 
	                    cp2.y, 
	                    c2.x, 
	                    c2.y);
                }
            }
        }
    }
    
    MapView.prototype.absolutizePoint = function (point) {
    	var newPoint = new Point2D();
    	//FIXME : remove dependancy from global backgroundGrid
    	newPoint.x = (point.x -  backgroundGrid.x + this.gridWidth / 2);
    	newPoint.y = (point.y -  backgroundGrid.y + this.gridHeight / 2);
    	
    	return newPoint;
    }

    window.MapView = MapView;
}(window));