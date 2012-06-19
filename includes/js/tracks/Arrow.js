(function (window) {

	function Arrow() {
		this.type = "Arrow";

		this.initialize();
	}

	Arrow.prototype = new Shape();
	Arrow.prototype.Shape_initialize = Arrow.prototype.initialize;

	//constructor
	Arrow.prototype.initialize = function () {
		this.Shape_initialize();
		this.visible = false;
		this.currentColor = colors.arrow;
		this.makeShape();
		this.carriage = null;
		this.targetConnector = null;
	}

	Arrow.prototype.show = function () {
		var topmost = trackapp.stage.getNumChildren();
		trackapp.stage.addChildAt(this, topmost);
		this.alpha = 0.8;
		this.visible = true;
		setDirty();
	}

	Arrow.prototype.hide = function () {
		this.visible = false;
		this.carriage = null;
		this.targetConnector = null;
		setDirty();
	}

	Arrow.prototype.onClick = function (evt) {
		trackapp.railway.hideArrows();
		this.carriage.start(this.targetConnector);
		setDirty();
	}

	Arrow.prototype.onMouseOver = function () {
		this.currentColor = colors.arrowHover;
		this.makeShape();
	}

	Arrow.prototype.onMouseOut = function () {
		this.currentColor = colors.arrow;
		this.makeShape();
	}

	Arrow.prototype.makeShape = function () {
		this.graphics.clear();

		this.regX = 6;
		this.regY = 6;

		this.graphics.clear();
		this.graphics.setStrokeStyle(1, "round").beginStroke(this.currentColor).beginFill(this.currentColor);
		this.graphics.moveTo(6, 0).lineTo(12, 12).lineTo(0, 12).lineTo(6, 0);

		//this.graphics.setStrokeStyle(6,"round").beginStroke(this.currentColor);
		//this.graphics.moveTo(6,0).lineTo(12,12).moveTo(12,12).lineTo(0,12).moveTo(0,12).lineTo(6,0);
		this.graphics.endFill();

		setDirty();
	}


	Arrow.prototype.getAngle = function (center, origin, target) {

		//Create Vectors
		var vectorA = new Object;
		vectorA.p1 = new Point2D(center.x, center.y);
		vectorA.p2 = new Point2D(origin.x, origin.y);

		var vectorB = new Object;
		vectorB.p1 = new Point2D(center.x, center.y);
		vectorB.p2 = new Point2D(target.x, target.y);

		// Make reference line a vector
		var Ax = vectorA.p2.x - vectorA.p1.x;
		var Ay = vectorA.p2.y - vectorA.p1.y;

		var Bx = vectorB.p1.x - vectorB.p2.x;
		var By = vectorB.p1.y - vectorB.p2.y;

		// Get the vector length
		var Alen = Math.sqrt(Ax * Ax + Ay * Ay);
		var Blen = Math.sqrt(Bx * Bx + By * By);

		// Make unit length
		// To work the coordinate system with an origin in the lower left rather than upper left corner
		// negate the y coords by adding a unary minus to rdy and dy in the division below.
		Ax = Ax / Alen;
		Ay = Ay / Alen;
		Bx = Bx / Blen;
		By = By / Blen;

		// Dot product and convert to degrees
		// To leave in radians just do: return ( Math.acos ( rdx * dx + rdy * dy ) );
		//return ( Math.acos ( rdx * dx + rdy * dy ) / 6.28 * 360 );	
		return (Math.atan2(By, Bx) - Math.atan2(Ay, Ax)) / (Math.PI * 2 / 360);
	}

	window.Arrow = Arrow;
}(window));