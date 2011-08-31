(function (window) {

    function CurvedTrack() {
        this.initialize();
    }

    CurvedTrack.prototype = new Track();

    CurvedTrack.prototype.Track_initialize = CurvedTrack.prototype.initialize; //unique to avoid overiding base class
    CurvedTrack.prototype.initialize = function () {
        this.Track_initialize();

        var cA = new Connector("MALE", 0, 36.7, 28, 65);
        var cB = new Connector("FEMALE", 148, 65, 176, 37);
		
		this.connectors.push( cA );
        this.connectors.push( cB );

		cA.createPath("main", cB, new Segment( "BEZIER", new Point2D(67.6, 9), new Point2D(112.9, 9)));
		
        //Pivot Point
        this.regX = 88;
        this.regY = 23;
        
        this.influence = 50; //the "magnet" influence radius of the track
        
        for (var element in this.connectors)	{	
			this.connectors[element].setRegistrationPoint(this.regX, this.regY);
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
    },

    CurvedTrack.prototype.setColor = function (newColor) {
        this.color = newColor;
        this.makeShape();
    },

    CurvedTrack.prototype.makeShape = function () {
    
        //Track Shape
        var g = this.trackShape.graphics;
        g.clear();
        g.setStrokeStyle(3);
        g.beginStroke(this.getStrokeColor());
        g.beginFill(this.getFillColor());
      		
      	g.moveTo(152.5, 50.4)
      		.bezierCurveTo(152.5, 44.9, 157.0, 40.4, 162.5, 40.4)
      		.bezierCurveTo(165.3, 40.4, 167.9, 41.6, 169.7, 43.4)
      		.bezierCurveTo(171.9, 41.2, 174.1, 39.0, 176.3, 36.9)
      		.bezierCurveTo(176.4, 36.8, 176.5, 36.7, 176.6, 36.6)
      		.bezierCurveTo(127.8, -12.2, 48.8, -12.2, 0.0, 36.6)
      		.bezierCurveTo(2.4, 39.0, 4.8, 41.4, 7.2, 43.8)
      		.bezierCurveTo(5.4, 45.6, 4.3, 48.1, 4.3, 50.9)
      		.bezierCurveTo(4.3, 56.4, 8.8, 60.9, 14.3, 60.9)
      		.bezierCurveTo(17.1, 60.9, 19.6, 59.7, 21.4, 57.9)
      		.bezierCurveTo(23.7, 60.2, 26.0, 62.5, 28.3, 64.9)
      		.bezierCurveTo(61.4, 31.7, 115.1, 31.7, 148.3, 64.9)
      		.bezierCurveTo(150.7, 62.4, 153.1, 60.0, 155.6, 57.6)
      		.bezierCurveTo(153.7, 55.7, 152.5, 53.2, 152.5, 50.4)
      		.closePath();	

        //Track Pivot Point
        var h = this.trackPivot.graphics;
        h.setStrokeStyle(0);
        h.beginFill("#A0998A");
        h.drawCircle(this.regX, this.regY, 4);

        setDirty();
    }

    window.CurvedTrack = CurvedTrack;
}(window));