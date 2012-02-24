(function (window) {

	function Gizmo() {
		this.initialize();
	}

	Gizmo.prototype = new Shape();
	Gizmo.prototype.Shape_initialize = Gizmo.prototype.initialize; //unique to avoid overiding base class
	// constructor:
	Gizmo.prototype.initialize = function () {
		this.Shape_initialize();
		this.snapToPixel = true;
	}

	Gizmo.prototype.clear = function () {
		this.graphics.clear();

		this.source = null;
		this.target = null;

		setDirty();
	}

	Gizmo.prototype.glue = function (source, target) {

		if (!source || !target) {
			return;
		}

		this.source = source;
		this.target = target;

		var g = this.graphics;
		g.clear();

		var controlPoint = new Point2D();

		var inverted = false;
		var result = this.getLineIntersection(this.source, this.target, inverted);

		if (result.status != "Intersection") {
			inverted = true;
			result = this.getLineIntersection(this.source, this.target, inverted);
		}

		if (result.status == "Intersection") {

			controlPoint = result.intersection;

			if (!inverted) {
				g.setStrokeStyle(1)
				.beginStroke("#434238")
				.beginFill("#403835")
				.moveTo(this.source.p1.x, this.source.p1.y)
				.quadraticCurveTo(controlPoint.x, controlPoint.y, this.target.p2.x, this.target.p2.y)
				.lineTo(this.target.p1.x, this.target.p1.y)
				.quadraticCurveTo(controlPoint.x, controlPoint.y, this.source.p2.x, this.source.p2.y)
				.lineTo(this.source.p1.x, this.source.p1.y)
				.closePath();
			} else {
				g.beginFill("#1F3333")
				.setStrokeStyle(1)
				.beginStroke("#434238")
				.moveTo(this.source.p1.x, this.source.p1.y)
				.quadraticCurveTo(controlPoint.x, controlPoint.y, this.target.p1.x, this.target.p1.y)
				.lineTo(this.target.p2.x, this.target.p2.y)
				.quadraticCurveTo(controlPoint.x, controlPoint.y, this.source.p2.x, this.source.p2.y)
				.lineTo(this.source.p1.x, this.source.p1.y)
				.closePath();
			}

		} else {
			//console.log("no intersection " + result.status);
		}
	}


	/* copyright 2002-2003, Kevin Lindsey */
	/* http://www.kevlindev.com/gui/math/intersection/Intersection.js */
	Gizmo.prototype.getLineIntersection = function (source, target, inverted) {

		var result = new Object();

		var a1 = new Point2D();
		var a2 = new Point2D();

		var b1 = new Point2D();
		var b2 = new Point2D();

		if (inverted === undefined) inverted = false;

		if (!inverted) {
			a1 = source.p1;
			a2 = target.p1;

			b1 = source.p2;
			b2 = target.p2;

		} else {
			a1 = source.p1;
			a2 = target.p2;

			b1 = source.p2;
			b2 = target.p1;
		}

		var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
		var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
		var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

		if (u_b != 0) {
			var ua = ua_t / u_b;
			var ub = ub_t / u_b;

			if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
				result.status = "Intersection";
				result.intersection = new Point2D(
				a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y));
			} else {
				result.status = "No Intersection";
			}
		} else {
			if (ua_t == 0 || ub_t == 0) {
				result.status = "Coincident";
			} else {
				result.status = "Parallel";
			}
		}

		return result;
	}

	window.Gizmo = Gizmo;
}(window));