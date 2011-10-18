(function (window) {

    function Grid( visibleWidth, visibleHeight ) {
    	this.type="Grid";
       
        this.visibleWidth  = visibleWidth;
        this.visibleHeight = visibleHeight;
        
        this.dx = this.visibleWidth/2;
        this.dy = this.visibleHeight/2;
        
        this.width  = this.visibleWidth;
        this.height = this.visibleHeight;
 		
 		this.absoluteX = 0;
 		this.absoluteY = 0;
 		
        this.initialize();
    }

    Grid.prototype = new Shape();
    Grid.prototype.Shape_initialize = Grid.prototype.initialize; //unique to avoid overriding base class
    // constructor:
    Grid.prototype.initialize = function () {
        this.Shape_initialize();
        this.snapToPixel = true;

        this.regX = this.visibleWidth/2;
        this.regY = this.visibleHeight/2;
               
        this.makeShape();
        this.clickWasADrag = false;
    }

    Grid.prototype.onPress = function (evt) {
		
		railroad.hideRotationDial();
		
		this.dx = this.visibleWidth/2;
        this.dy = this.visibleHeight/2;

        var offset = {
            x: this.dx - evt.stageX,
            y: this.dy - evt.stageY
        };

        var grid = this;
        this.clickWasADrag = false;
        // add a handler to the event object's onMouseMove callback
        // this will be active until the user releases the mouse button:
        evt.onMouseMove = function (ev) {
            var x = ev.stageX + offset.x;
            var y = ev.stageY + offset.y;
            
            grid.move(x, y);
            grid.clickWasADrag = true;
            // indicate that the stage should be updated on the next tick:
            setDirty();
        };
        
        evt.onMouseUp = function (ev) {
        	if (!grid.clickWasADrag){
    			//clear selection
        		railroad.selection.reset();
        	}
    	}   
    }

    Grid.prototype.move = function( x, y ){
    	var displaceX = x - this.dx;
    	var displaceY = y - this.dy;
 
     	this.dx = x;
    	this.dy = y;
    	
    	this.absoluteX += displaceX;
    	this.absoluteY += displaceY;
    	    	
    	this.x = this.regX + this.absoluteX%200;
    	this.y = this.regY + this.absoluteY%200;

    	//FIXME : we should move all objects
    	railroad.moveAllTracks(displaceX, displaceY);
    }
    
    Grid.prototype.makeShape = function() {
    	var g = this.graphics;
		
		g.clear();
		g.beginFill(colors.gridBackground);
		g.rect(-200,-200,this.width + 4200,this.height + 400);
		
		for(var i=-20; i<20+ this.visibleWidth/10; i++) {
			g.setStrokeStyle(1);
			
			( i%5 ) ? color=colors.gridMainLine : color=colors.gridSecondaryLine;

        	g.beginStroke(color);
        	g.moveTo(i*20,-200).lineTo(i*20,this.visibleHeight);
		}
		
		for (var j=-20; j< 20+this.visibleHeight/10; j++) {
			g.setStrokeStyle(1);
			
			( j%5 ) ? color=colors.gridMainLine : color=colors.gridSecondaryLine;

        	g.beginStroke(color);
        	g.moveTo(-200,j*20).lineTo(this.visibleWidth,j*20);
		}
		
		this.cache(-200,-200,this.visibleWidth + 200, this.visibleHeight + 200);
    }
    
    Grid.prototype.resetView = function() {
    	this.dx = this.visibleWidth/2;
        this.dy = this.visibleHeight/2;

    	this.move(this.dx-this.absoluteX,this.dy-this.absoluteY);
    	setDirty();    
    }
    
    Grid.prototype.onDoubleClick = function(ev) {
    	this.resetView();
   	}
   	
   	Grid.prototype.absolutizePoint = function (point) {
    	var newPoint = new Point2D();

    	newPoint.x = point.x - this.absoluteX; 
    	newPoint.y = point.y - this.absoluteY;
    	
    	return newPoint;
    }

    window.Grid = Grid;
}(window));