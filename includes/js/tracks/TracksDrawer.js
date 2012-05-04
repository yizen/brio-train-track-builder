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
	
	TracksDrawer.prototype.initWithLibrary = function (library) {
		for (var trackNumber in library.library.tracks) {
			this.addTemplate(library.library.tracks[trackNumber].name);
		}	
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
		
		this.removeAllChildren();	 
		
		//Don't display the drawer for empty drawers
		if (this.templates.length == 0) return;
		
		for (var i in this.templates) {
			
			var child = new Track(this.templates[i]);
			
			child.setRenderingContext(config.smallTemplate);
			
			child.onPress = function (evt) {
			
				var newTrack = new Track(this.config.name);
				railway.addTrack(newTrack);
				
				newTrack.x = evt.stageX;
				newTrack.y = evt.stageY;
					   			
				evt.doNoSave = true;	   			
					   			
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
		
		var width = lastChildx - childWidth + 80;
		var height = 90;
		/*
		g.beginLinearGradientStroke ( ["#181818","#363636","#181818" ] , [0, 0.5, 1] , 0 , 0 , width , 1 );
		g.setStrokeStyle(1);
		g.moveTo(0,0);
		g.lineTo(width,0);
		
		g.endStroke();
		g.beginRadialGradientFill(["#202020", "#101010"], [0, 1], width/2,0,0,  width/2,0, width);
		g.rect(0,1,width,height);
		*/
				
		this.x = 20;
		this.y = backgroundGrid.visibleHeight - 120;
	}
	
	window.TracksDrawer = TracksDrawer;
}(window));
