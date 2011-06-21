(function (window) {

    function LongTrack() {
        this.initialize();
    }

    LongTrack.prototype = new Track();

    LongTrack.prototype.Track_initialize = LongTrack.prototype.initialize; //unique to avoid overiding base class
    LongTrack.prototype.initialize = function () {
        this.Track_initialize();

        this.connectors.push(new Connector("MALE", 16, 0, 16, 40));
        this.connectors.push(new Connector("FEMALE", 232, 40, 232, 0));

        //Pivot Point
        this.regX = 115;
        this.regY = 20;
        
        this.influence = 115; //the "magnet" influence radius of the track
        
        for (var element in this.connectors)	{	
			this.connectors[element].setRegistrationPoint(this.regX, this.regY);
		};

        this.trackShape = new Shape();
        this.trackShape.snapToPixel = true;

        this.trackPivot = new Shape();
        this.trackPivot.snapToPixel = true;

        this.addChild(this.trackShape);
        this.addChild(this.trackPivot);

        this.makeShape();
    },

    LongTrack.prototype.setColor = function (newColor) {
        this.color = newColor;
        this.makeShape();
    },

    LongTrack.prototype.makeShape = function () {
    
        //Track Shape
        var g = this.trackShape.graphics;
        g.clear();
        g.setStrokeStyle(3);
        g.beginStroke(this.getStrokeColor());
        g.beginFill(this.getFillColor());
        //g.drawRect(0, 0, 100, 40);
        g.moveTo(46.8, 0.0)
	      .lineTo(15.8, 0.0)
	      .lineTo(15.8, 16.0)
	      .lineTo(9.8, 16.0)
	      .lineTo(9.8, 16.0)
	      .bezierCurveTo(8.7, 14.8, 7.2, 14.0, 5.5, 14.0)
	      .bezierCurveTo(2.5, 14.0, 0.0, 16.5, 0.0, 19.5)
	      .bezierCurveTo(0.0, 22.5, 2.5, 25.0, 5.5, 25.0)
	      .bezierCurveTo(7.2, 25.0, 8.7, 24.2, 9.8, 23.0)
	      .lineTo(9.8, 23.0)
	      .lineTo(15.8, 23.0)
	      .lineTo(15.8, 40.0)
	      .lineTo(46.8, 40.0)
	      .lineTo(53.8, 40.0)
	      .lineTo(231.8, 40.0)
	      .lineTo(231.8, 23.0)
	      .lineTo(225.8, 23.0)
	      .lineTo(225.8, 22.7)
	      .bezierCurveTo(224.8, 24.1, 223.1, 25.0, 221.2, 25.0)
	      .bezierCurveTo(218.2, 25.0, 215.8, 22.5, 215.8, 19.5)
	      .bezierCurveTo(215.8, 16.5, 218.2, 14.0, 221.2, 14.0)
	      .bezierCurveTo(223.1, 14.0, 224.8, 14.9, 225.8, 16.3)
	      .lineTo(225.8, 16.0)
	      .lineTo(231.8, 16.0)
	      .lineTo(231.8, 0.0)
	      .lineTo(53.8, 0.0)
	      .lineTo(46.8, 0.0)
	      .closePath();
      
        //Track Pivot Point
        var h = this.trackPivot.graphics;
        h.setStrokeStyle(0);
        h.beginFill("#A0998A");
        h.drawCircle(this.regX, this.regY, 4);

        setDirty();
    }

    window.LongTrack = LongTrack;
}(window));