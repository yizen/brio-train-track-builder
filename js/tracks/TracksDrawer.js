(function (window) {

	function TracksDrawer() {
		this.initialize();
	}

	TracksDrawer.prototype = new Container();
	TracksDrawer.prototype.Container_initialize = TracksDrawer.prototype.initialize; //unique to avoid overriding base class
	
	TracksDrawer.prototype.initialize = function () {
		this.type = "TracksDrawer";
		this.templates = new Array();	  	

		this.Container_initialize();
		
		this.drawerShape = new Shape();
		this.drawerShape.snapToPixel = true;
		this.addChild(this.drawerShape);
	}
	
	TracksDrawer.prototype.resetAllTemplates = function() {
		this.templates = new Array();
		this.makeShape();
	}
	
	TracksDrawer.prototype.addTemplate = function (trackTypeName) {
		if (this.templates.indexOf(trackTypeName) != -1) {
			//Element already exists
			return;		
		}
		
		this.templates.push(trackTypeName);
		this.makeShape();
	
	}
	
	TracksDrawer.prototype.makeShape = function() {
	
		var lastChildx = 60;
		var childWidth = 100;	 
		
		//Don't display the drawer for empty drawers
		if (this.templates.length == 0) return;
		
		for (var i in this.templates) {
			
			var child = new Track(this.templates[i]);
			
			child.setRenderingContext(config.smallTemplate);
			
			child.onPress = function (evt) {
			
				var newTrack = new Track(this.config.name);
				railroad.addTrack(newTrack);
				
				newTrack.x = evt.stageX;
				newTrack.y = evt.stageY;
					   			
				newTrack.onPress(evt);			
			}
			
			child.scaleX = 0.5;
			child.scaleY = 0.5;

			this.addChild(child);
			
			child.x = lastChildx;
			child.y = 45;
			lastChildx += childWidth;
		}
		
		var g = this.drawerShape.graphics;
		g.clear();
		g.beginFill(colors.tracksDrawerFill);
		g.rect(0,0,lastChildx - childWidth + 80, 90);
		
		
		this.x = 20;
		this.y = backgroundGrid.visibleHeight - 120;
	}
	
	window.TracksDrawer = TracksDrawer;
}(window));
