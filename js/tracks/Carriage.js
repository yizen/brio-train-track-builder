(function (window) {

    function Carriage() {
    	this.type = "Carriage";
    
    	this.initialize();
    }

    Carriage.prototype = new Container();
    Carriage.prototype.Container_initialize = Carriage.prototype.initialize; //unique to avoid overriding base class
    // constructor:
    Carriage.prototype.initialize = function () {
        this.Container_initialize();

        this.carriage = new Shape();
        this.carriage.snapToPixel = true;
                
        //this.regX = -50;
        //this.regY = -15;
        
        //TODO : Generalize to more than to bogies.
        this.bogieFront = new Bogie();
        this.bogieBack  = new Bogie();
        
        this.addChild(this.bogieFront);
        this.addChild(this.bogieBack);
        
        this.bogieFrontdx = 20;
        this.bogieFrontdy = 15;
        
        this.bogieFront.x = this.bogieFrontdx;
        this.bogieFront.y = this.bogieFrontdy;
        
        this.bogieBack.x = 80;
        this.bogieBack.y = 15;
        
        this.targetPoint = null;
        
        this.makeShape();
        this.addChild(this.carriage);
    }

    Carriage.prototype.makeShape = function () {
        var g = this.carriage.graphics;

        g.clear();
        g.setStrokeStyle(1);
        g.beginStroke(colors.carriageStroke);
        g.beginFill(colors.carriageFill);
        g.drawRect(0, 0, 100, 30);
        
        if (this.targetPoint) {
        	g.beginFill("#000000");
        	g.drawCircle(-this.x + this.targetPoint.point.x , - this.y + this.targetPoint.point.y,5);
        }
               
        setDirty();
    }
       Carriage.prototype.onPress = function (evt) { 
    
    	railroad.hideRotationDial();
    	railroad.forwardArrow.hide();
		railroad.backwardArrow.hide();

    	var offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        
        var draggedCarriage = this; //The dragged element.
          
		evt.onMouseMove = function (ev) {
        	x = ev.stageX + offset.x;
            y = ev.stageY + offset.y;
            
            draggedCarriage.moveWithMagnetism(x,y);
        };
		
		evt.onMouseUp = function (ev) {
			setDirty();
		};
	}
	
	Carriage.prototype.move = function(x,y) {
		this.x = x;
		this.y = y;
		setDirty();		
	}
	
	Carriage.prototype.moveBy = function( dx, dy) {
    	this.move(this.x + dx, this.y + dy);
    }
    
    Carriage.prototype.moveWithMagnetism = function(x,y) {
    	this.targetPoint = null;
    	this.targetPoint = this.bogieFront.moveWithMagnetism(x + this.bogieFrontdx, y + this.bogieFrontdy);
    	
    	
    	if (this.targetPoint.point) {
    		this.move(this.targetPoint.point.x - this.bogieFrontdx, this.targetPoint.point.y - this.bogieFrontdy);
    	}
    	
       	//this.move(x, y);
    	this.makeShape();
    }
    
    Carriage.prototype.start = function(connector) {
    	this.makeShape();
     }
    
   	Carriage.prototype.tick = function() {
   		
   	}
   		
    window.Carriage = Carriage;
}(window));