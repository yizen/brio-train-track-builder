var Connector = Class.extend({

	init: function (track, type, p1, p2) {
		this.track = track;

		this.type = type;

		this.p1 = new Point2D(parseFloat(p1.x), parseFloat(p1.y));
		this.p2 = new Point2D(parseFloat(p2.x), parseFloat(p2.y));
		
		this.isAxisForFlip = false;
		
		this.original = new Object; // will store original values
		this.original.p1 = this.p1.clone();
		this.original.p2 = this.p2.clone();
	
		this.previous = new Point2D(0, 0);

		this.angle = 0;

		this.edge = null;

		this.shape = new Shape();
		this.shapeDraw();

		stage.addChild(this.shape);
	},

	evalType: function () {
		if (this.type == "MALE") {
			return 1;
		} else {
			return 0;
		}
	},

	shapeDraw: function () {
		if (!debug.connector) return;

		this.shape.graphics.clear();
		this.shape.graphics.endFill();
		this.shape.graphics.setStrokeStyle(4);

		this.edge ? color = "#B92233" : color = "#434238";

		this.shape.graphics.beginStroke(color);
		this.shape.graphics.moveTo(this.p1.x, this.p1.y).lineTo(this.p2.x, this.p2.y);

		this.edge ? stroke = 4 : stroke = 1;

		this.shape.graphics.setStrokeStyle(stroke).beginStroke("#fff");
		this.shape.graphics.beginFill("#961B2E"); //RED
		this.shape.graphics.drawEllipse(this.p1.x - 5, this.p1.y - 5, 10, 10);

		this.shape.graphics.beginFill("#24734B"); //GREEN
		this.shape.graphics.drawEllipse(this.p2.x - 5, this.p2.y - 5, 10, 10);
		
		this.shape.graphics.beginFill("#112211"); //GREY
		this.shape.graphics.drawEllipse(this.getCenter().x - 5, this.getCenter().y - 5, 10, 10);

		setDirty();
	},

	setRegistrationPoint: function (regX, regY) {
		this.p1.rmoveto(-regX, -regY);
		this.p2.rmoveto(-regX, -regY);
		this.shapeDraw();
	},

	getDistance: function (connectorB) {
		// returns the minimum distance between the two connectors.
		var distances = new Array();
		distances.push(this.p1.distanceFrom(connectorB.p1));
		distances.push(this.p1.distanceFrom(connectorB.p2));
		distances.push(this.p2.distanceFrom(connectorB.p1));
		distances.push(this.p2.distanceFrom(connectorB.p2));

		var min = Math.min.apply(null, distances);
		return min;
	},

	move: function (x, y) {
		dx = x - this.previous.x;
		dy = y - this.previous.y;

		this.p1.rmoveto(dx, dy);
		this.p2.rmoveto(dx, dy);

		this.previous.x = x;
		this.previous.y = y;

		this.shapeDraw();
	},

	rotate: function (angle, pivotPoint) {

		var pivotAngle = angle - this.angle;
		this.angle = angle;

		if (pivotPoint === undefined) {
			console.error("Connector.rotate : pivotPoint undefined");
			return;
		}

		this.p1.rotate(pivotAngle, pivotPoint);
		this.p2.rotate(pivotAngle, pivotPoint);

		this.shapeDraw();
	},

	match: function (connectorB) {

		if (this.edge || connectorB.edge) return false;


		if (this.type != connectorB.type) {
			return true;
		} else {
			return false;
		}
	},

	connectTo: function (connectorB) {
		this.edge = connectorB;
		connectorB.edge = this;
	},

	getCenter: function (original) {
	
		if (original === undefined) {
			return new Point2D((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2);
		} else {
			return new Point2D((this.original.p1.x + this.original.p2.x) / 2, (this.original.p1.y + this.original.p2.y) / 2);
		}
	},

	resetConnection: function () {
		if (!this.edge) return;

		if (this.edge.edge) this.edge.edge = null;

		this.edge = null;
	}
});