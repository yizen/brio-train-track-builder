(function (window) {

    function TripleTrack() {
        this.initialize();
    }

    TripleTrack.prototype = new Track();

    TripleTrack.prototype.Track_initialize = TripleTrack.prototype.initialize; //unique to avoid overiding base class
    TripleTrack.prototype.initialize = function () {
        this.Track_initialize();

        cA = new Connector("FEMALE", 0, 0, 0, 40);
        cB = new Connector("MALE", 150, 40, 150, 0);
        cC = new Connector("MALE", 25, 125, 65, 125);
        
        this.connectors.push(cA, cB, cC);
        
        this.addSegment(new Segment("LINE", cA, cB));
		this.addSegment(new Segment("BEZIER", cB, cC, new Point2D(66.5,20), new Point2D(44,88) ));
        
        //Pivot Point
        this.regX = 80;
        this.regY = 67;
        
        this.influence = 50; //the "magnet" influence radius of the track
        
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
    },

    TripleTrack.prototype.setColor = function (newColor) {
        this.color = newColor;
        this.makeShape();
    },

    TripleTrack.prototype.makeShape = function () {
    
        //Track Shape
        var g = this.trackShape.graphics;
        g.clear();
        g.setStrokeStyle(3);
        g.beginStroke(this.getStrokeColor());
        g.beginFill(this.getFillColor());
			
		g.moveTo(150.0, 10.1)
		      .lineTo(150.0, 9.8)
		      .bezierCurveTo(150.0, 6.7, 150.0, 3.6, 150.0, 0.5)
		      .bezierCurveTo(150.0, 0.3, 150.0, 0.2, 150.0, 0.1)
		      .lineTo(150.0, 0.0)
		      .lineTo(0.0, 0.0)
		      .lineTo(0.0, 10.1)
		      .bezierCurveTo(5.4, 10.2, 9.8, 14.6, 9.8, 20.0)
		      .bezierCurveTo(9.8, 25.4, 5.4, 29.8, 0.0, 29.9)
		      .lineTo(0.0, 40.0)
		      .lineTo(58.7, 40.0)
		      .bezierCurveTo(38.1, 62.3, 25.5, 92.2, 25.5, 125.0)
		      .bezierCurveTo(28.9, 125.0, 32.3, 125.0, 35.7, 125.0)
		      .bezierCurveTo(35.7, 127.0, 36.7, 130.1, 38.6, 132.0)
		      .bezierCurveTo(42.5, 136.0, 48.9, 136.0, 52.8, 132.1)
		      .bezierCurveTo(54.7, 130.1, 55.7, 127.0, 55.7, 125.0)
		      .bezierCurveTo(59.0, 125.0, 62.2, 125.0, 65.5, 125.0)
		      .bezierCurveTo(65.5, 78.0, 103.0, 40.1, 150.0, 40.1)
		      .bezierCurveTo(150.0, 40.1, 150.0, 40.0, 150.0, 40.0)
		      .bezierCurveTo(150.0, 36.6, 150.0, 33.3, 150.0, 29.9)
		      .bezierCurveTo(155.4, 29.8, 159.8, 25.4, 159.8, 20.0)
		      .bezierCurveTo(159.8, 14.6, 155.4, 10.2, 150.0, 10.1)
		      .closePath();

        //Track Pivot Point
        var h = this.trackPivot.graphics;
        h.setStrokeStyle(0);
        h.beginFill("#A0998A");
        h.drawCircle(this.regX, this.regY, 4);

        setDirty();
    }

    window.TripleTrack = TripleTrack;
}(window));