(function (window) {

	function MapView(originalGrid, zoomFactor, width, height) {
		this.type = "MapView";
	
		this.zoomFactor = zoomFactor;

		this.gridWidth	 = originalGrid.visibleWidth;
		this.gridHeight = originalGrid.visibleHeight;
		
		this.originalGrid = originalGrid;
	
		this.width	= width;
		this.height = height;
		
		this.initialize();
	}

	MapView.prototype = new Container();
	MapView.prototype.Container_initialize = MapView.prototype.initialize; //unique to avoid overriding base class
	MapView.prototype.initialize = function () {
		this.Container_initialize();
		
		this.background = new Shape();
		this.background.snapToPixel = true;
		this.background.width = this.width;
		this.background.height = this.height;
		//this.background.regX = this.width / 2;
		//this.background.regY = this.height / 2;

		this.map = new Shape();
		this.map.snapToPixel = true;
	   
		this.map.scaleX = this.zoomFactor;
		this.map.scaleY = this.zoomFactor;
		
		this.map.width	= this.gridWidth;
		this.map.height = this.gridHeight;
		
		this.map.regX	= this.map.width / 2;
		this.map.regY	= this.map.height / 2
		
		this.map.x = this.width / 2;
		this.map.y = this.height / 2;

		this.addChild(this.background);
		this.addChild(this.map);
	}

	MapView.prototype.makeShape = function () {
	
		var h = this.background.graphics;
		h.clear();
		h.beginFill(colors.mapViewBackground);
		h.rect(0, 0, this.width , this.height).endFill();
		
		var g = this.map.graphics;
		g.clear();
		
		for (var track in trackapp.railway.tracks) {
			this.drawPath(trackapp.railway.tracks[track], g);
		}
		
		g.beginFill(colors.mapViewViewport).setStrokeStyle(1 / this.zoomFactor).beginStroke("#000");
		
		var x = -this.originalGrid.absoluteX;
		var y = -this.originalGrid.absoluteY;
		
		var height = this.gridHeight;
		var width  = this.gridWidth;

		g.rect(x,y,width,height);
		g.endFill();
	}
	
	MapView.prototype.refresh = function() {
		this.makeShape();
		setDirty();
	}

	MapView.prototype.drawPath = function (track, graphics) {

		for (var segmentIndex in track.segments) {
			var c1 = trackapp.backgroundGrid.absolutizePoint ( track.segments[segmentIndex].connectorA.getCenter() );
			var c2 = trackapp.backgroundGrid.absolutizePoint ( track.segments[segmentIndex].connectorB.getCenter() );

			graphics.endFill().setStrokeStyle(4/this.zoomFactor).beginStroke("#000");

			if (track.segments[segmentIndex].type == "LINE") {
				graphics.moveTo(c1.x, c1.y).lineTo(c2.x, c2.y).closePath();
			} else {
				cp1 = trackapp.backgroundGrid.absolutizePoint ( track.segments[segmentIndex].cp1 );
				cp2 = trackapp.backgroundGrid.absolutizePoint ( track.segments[segmentIndex].cp2 );

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
			graphics.endFill().setStrokeStyle(2/this.zoomFactor).beginStroke("#000");
			
			var p1 = trackapp.backgroundGrid.absolutizePoint ( track.connectors[connector].p1 );
			var p2 = trackapp.backgroundGrid.absolutizePoint ( track.connectors[connector].p2 );

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