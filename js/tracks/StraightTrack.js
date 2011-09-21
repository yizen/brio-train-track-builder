(function (window) {

    function StraightTrack() {
        this.initialize();
    }

    StraightTrack.prototype = new Track();

    StraightTrack.prototype.Track_initialize = StraightTrack.prototype.initialize; //unique to avoid overiding base class
    StraightTrack.prototype.initialize = function () {
        this.Track_initialize();

		var cA = new Connector("FEMALE", 0, 0, 0, 40);
		var cB = new Connector("MALE", 90, 40, 90, 0);
        this.connectors.push( cA, cB );
        
        this.addSegment(new Segment("LINE", cA, cB));

        //Pivot Point
        this.regX = 50;
        this.regY = 20;
        
        this.influence = 40; //the "magnet" influence radius of the track
        
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

    StraightTrack.prototype.setColor = function (newColor) {
        this.color = newColor;
        this.makeShape();
    },

    StraightTrack.prototype.makeShape = function () {
       //Track Shape
        var g = this.trackShape.graphics;
        g.clear();
        g.setStrokeStyle(3);
        g.beginStroke(this.getStrokeColor());
        g.beginFill(this.getFillColor());
        //g.drawRect(0, 0, 100, 40);
		g.moveTo(100, 20.0)
      		.bezierCurveTo(100, 14.6, 95.4, 10.2, 90.0, 10.1)
      		.lineTo(90.0, 0.0)
      		.lineTo(0.0, 0.0)
      		.lineTo(0.0, 10.1)
      		.bezierCurveTo(5.4, 10.2, 9.8, 14.6, 9.8, 20.0)
      		.bezierCurveTo(9.8, 25.4, 5.4, 29.8, 0.0, 30)
      		.lineTo(0.0, 40.0)
      		.lineTo(90.0, 40.0)
      		.lineTo(90.0, 30)
      		.bezierCurveTo(95.4, 29.8, 99.8, 25.4, 99.8, 20.0)
      		.closePath();

        //Track Pivot Point
        var h = this.trackPivot.graphics;
        h.setStrokeStyle(0);
        h.beginFill("#A0998A");
        h.drawCircle(this.regX, this.regY, 4);

        setDirty();
    }

    window.StraightTrack = StraightTrack;
}(window));