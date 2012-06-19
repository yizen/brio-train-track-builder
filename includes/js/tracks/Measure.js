(function (window) {

	function Measure() {
		this.initialize();
		this.coord = new Object;
	}

	Measure.prototype = new Container();
	Measure.prototype.Container_initialize = Measure.prototype.initialize; //unique to avoid overiding base class
	// constructor:
	
	Measure.prototype.initialize = function () {
		this.Container_initialize();
		this.snapToPixel = true;
		
		this.lines = new Shape();
		this.addChild(this.lines);
		
		this.hMeasure = new Text("","14px Courier", "#fff");
		this.vMeasure = new Text("","14px Courier", "#fff");
		
		this.addChild(this.hMeasure);
		this.addChild(this.vMeasure);
		this.vMeasure.rotation = -90;
	}
	
	Measure.prototype.refresh = function() {
		this.coord = trackapp.railway.measure();
		this.makeShape();
		
	}

	Measure.prototype.makeShape= function() {
		var g = this.lines.graphics;
		g.clear();
				
		if (Math.round((this.coord.xMax - this.coord.xMin)/10) > 9) {
			g.beginStroke("#fff").setStrokeStyle(1);

			g.moveTo(this.coord.xMin, this.coord.yMin-40);
			g.lineTo(this.coord.xMax, this.coord.yMin-40);
			
			g.moveTo(this.coord.xMin-5, this.coord.yMin-40-5);
			g.lineTo(this.coord.xMin+5, this.coord.yMin-40+5);
	
			g.moveTo(this.coord.xMax-5, this.coord.yMin-40-5);
			g.lineTo(this.coord.xMax+5, this.coord.yMin-40+5);
			
			g.endStroke();
			g.beginFill(colors.gridBackground);
			g.rect(this.coord.xMin + ( this.coord.xMax - this.coord.xMin ) / 2 - 20, this.coord.yMin - 55, 60, 20 );
			
			this.hMeasure.text = Math.round((this.coord.xMax - this.coord.xMin)/10);
			this.hMeasure.x = this.coord.xMin + ( this.coord.xMax - this.coord.xMin ) / 2;
			this.hMeasure.y = this.coord.yMin - 35;
		} else {
			this.hMeasure.text = "";
		}
		
		if (Math.round((this.coord.yMax - this.coord.yMin)/10) > 9) {
			g.beginStroke("#fff").setStrokeStyle(1);

			g.moveTo(this.coord.xMin-40, this.coord.yMin);
			g.lineTo(this.coord.xMin-40, this.coord.yMax);
			
			g.moveTo(this.coord.xMin-40-5, this.coord.yMin-5);
			g.lineTo(this.coord.xMin-40+5, this.coord.yMin+5);
	 
			g.moveTo(this.coord.xMin-40-5, this.coord.yMax-5);
			g.lineTo(this.coord.xMin-40+5, this.coord.yMax+5);
			
			g.endStroke();
			g.beginFill(colors.gridBackground);
			g.rect(this.coord.xMin - 40 - 20, this.coord.yMin + ( this.coord.yMax - this.coord.yMin ) / 2 - 20 , 40, 40 );
			
			this.vMeasure.text = Math.round((this.coord.yMax - this.coord.yMin)/10);
			this.vMeasure.x = this.coord.xMin - 35;
			this.vMeasure.y = this.coord.yMin + ( this.coord.yMax - this.coord.yMin ) / 2 + 10;
		} else {
			this.vMeasure.text = "";
		}
		
	}
	
	window.Measure = Measure;
}(window));