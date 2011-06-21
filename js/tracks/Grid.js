(function (window) {

    function Grid( gridWidth, gridHeight ) {
	    this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.initialize();
    }

    Grid.prototype = new Shape();
    Grid.prototype.Shape_initialize = Grid.prototype.initialize; //unique to avoid overiding base class
    // constructor:
    Grid.prototype.initialize = function () {
        this.Shape_initialize();
        this.snapToPixel = true;

        this.regX = this.gridWidth/2;
        this.regY = this.gridHeight/2;

        this.makeShape();
        this.clickWasADrag = false;
    }

    Grid.prototype.onPress = function (evt) {

		railroad.hideRotationDial();
		
        var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };

        var obj = this;
        this.clickWasADrag = false;
        // add a handler to the event object's onMouseMove callback
        // this will be active until the user releases the mouse button:
        evt.onMouseMove = function (ev) {
            var x = ev.stageX + offset.x;
            var y = ev.stageY + offset.y;
            
            obj.move(x, y);
            obj.clickWasADrag = true;
            // indicate that the stage should be updated on the next tick:
            setDirty();
        };
        
        evt.onMouseUp = function (ev) {
        	if (!obj.clickWasADrag){
    			//clear selection
        		railroad.selection.reset();
        	}
    	}   
    }

    Grid.prototype.move = function( x, y ){
    
    	var dx = x - this.x;
    	var dy = y - this.y;
    	    
    	this.x = x;
    	this.y = y;
    	
    	railroad.moveAllTracks(dx, dy);
    }
    
    Grid.prototype.makeShape = function() {
    	var g = this.graphics;
		
		g.clear();
		g.beginFill("#0b9ad3");
		g.rect(0,0,this.gridWidth,this.gridHeight);
		
		for(var i=0; i<this.gridWidth/10; i++) {
			g.setStrokeStyle(1);
			
			( i%5 ) ? color="#21a2d6" : color="#33aada";

        	g.beginStroke(color);
        	g.moveTo(i*20,0).lineTo(i*20,this.gridHeight);
		}
		
		for (var j=0; j< this.gridHeight / 20; j++) {
			g.setStrokeStyle(1);
			
			( j%5 ) ? color="#21a2d6" : color="#33aada";

        	g.beginStroke(color);
        	g.moveTo(0,j*20).lineTo(this.gridWidth,j*20);
		}
		
		this.cache(0,0,this.gridWidth, this.gridHeight);		
    }
    

    window.Grid = Grid;
}(window));