(function (window) {

	function Bogie() {
		this.type = "Bogie";

		this.initialize();
	}

	Bogie.prototype = new Container();
	Bogie.prototype.Container_initialize = Bogie.prototype.initialize; //unique to avoid overriding base class
	// constructor:
	Bogie.prototype.initialize = function () {
		this.Container_initialize();

		this.bogie = new Shape();
		this.bogie.snapToPixel = true;

		this.makeShape();
		this.addChild(this.bogie);

		this.snappedPoint = new Point2D();
		this.snappedSegment = new Object();
		this.snapped = false;
		this.targetConnector = null;

		this.pointsInPath = new Array();
		this.indexInPath = 0;
	}

	Bogie.prototype.makeShape = function () {
		var g = this.bogie.graphics;

		g.clear();
		g.beginFill(colors.bogieMagnetPoint);
		g.drawCircle(0, 0, 10);
		g.endFill();

		setDirty();
	}

	Bogie.prototype.onPress = function (evt) {

		railroad.hideRotationDial();

		railroad.forwardArrow.hide();
		railroad.backwardArrow.hide();

		var offset = {
			x: this.x - evt.stageX,
			y: this.y - evt.stageY
		};

		var draggedBogie = this; //The dragged element.
		evt.onMouseMove = function (ev) {
			x = ev.stageX + offset.x;
			y = ev.stageY + offset.y;

			draggedBogie.moveWithMagnetism(x, y);
		};

		evt.onMouseUp = function (ev) {

		};
	}

	Bogie.prototype.move = function (x, y) {
		this.x = x;
		this.y = y;
		setDirty();
	}

	Bogie.prototype.moveBy = function (dx, dy) {
		this.move(this.x + dx, this.y + dy);
	}

	Bogie.prototype.moveWithMagnetism = function (x, y) {
		this.snapped = false;

		var objectsUnderPoint = stage.getObjectsUnderPoint(x, y);
		var targetPoint = this.createNewTargetPoint(x, y);

		for (var obj in objectsUnderPoint) {
			var objectType = objectsUnderPoint[obj].type;
			var objectPointer = objectsUnderPoint[obj];

			if (objectType === undefined) {
				objectType = objectsUnderPoint[obj].parent.type;
				objectPointer = objectsUnderPoint[obj].parent;
			}

			if (objectType == "Track") {
				var targetPoint = this.snapToSegment(new Point2D(x, y), objectPointer);
			}
		}

		//this.move(targetPoint.point.x,targetPoint.point.y);
		this.makeShape();
		return (targetPoint);
	}

	Bogie.prototype.createNewTargetPoint = function (x, y) {
		var targetPoint = new Object();
		targetPoint.distance = Number.MAX_VALUE;
		targetPoint.point = new Point2D(x, y);
		targetPoint.snapped = false;

		return targetPoint;
	}

	Bogie.prototype.snapToSegment = function (point, object, targetPoint) {
		var points = object.getAllPoints();

		if (targetPoint === undefined) {
			var targetPoint = this.createNewTargetPoint(point.x, point.y);
		}

		for (var p in points) {

			var candidatePoint = new Point2D(points[p].x, points[p].y);
			var calculatedDistance = candidatePoint.distanceFrom(point);

			if (targetPoint.distance > calculatedDistance) {
				targetPoint.distance = calculatedDistance;
				targetPoint.point = candidatePoint;
				targetPoint.segment = points[p].segment;
				targetPoint.snapped = true;

				this.snapped = true;
				this.snappedPoint = candidatePoint;
				this.snappedSegment = points[p].segment;
				this.snappedPosition = points[p].position;
			}
		}

		return targetPoint;

	}

	Bogie.prototype.start = function (connector) {

		console.log("STARTING @ SNAPPED POSITION :" + this.snappedPosition);
		this.pointsInPath = new Array();
		this.indexInPath = this.snappedPosition;
		this.targetConnector = connector;

		if (connector == this.snappedSegment.connectorB) {
			//console.log("STARTED : GOING TO CONNECTOR B");
			this.pointsInPath = this.snappedSegment.getPoints(this.pointsInPath);
		}

		if (connector == this.snappedSegment.connectorA) {
			//console.log("STARTED : GOING TO CONNECTOR A");
			this.pointsInPath = this.snappedSegment.getPoints(this.pointsInPath, true);
			this.indexInPath = config.pathPrecision - this.indexInPath;
		}

		console.log("------- " + this.indexInPath + " --------");
	}

	Bogie.prototype.step = function () {

		var result = new Object();
		result.status = "MOVING";
		result.point = new Point2D();

		//console.log("CURRENT STEP :"+this.indexInPath+" ON TRACK NUMBER "+this.targetConnector.track.id);
		//Test if we still have point on the track to move
		if (this.indexInPath >= config.pathPrecision - 1) {
			//We've reached the end of the track		
			console.log("END OF TRACK");
			this.snappedPoint = new Point2D(this.x, this.y);

			//Is it the end of the path ?
			if (this.targetConnector.edge != null) {
				console.log("MOVING ON TO TRACK " + this.targetConnector.edge.track.id);
				this.requestNextTrack();

				result.status = "NEXTTRACK";

			} else {
				//Yes : we're stopping
				console.log("NOWHERE ELSE TO GO : STOP");
				console.log("-------------------------");

				//FIXME : this confusing : we need to isolate the "end of movement" and "snapping" logic.
				if (this.targetConnector == this.snappedSegment.connectorA) {
					this.snappedPosition = 0;
				} else {
					this.snappedPosition = config.pathPrecision;
				}

				result.status = "STOPPED";
			}
			//We're moving along the path	
		} else {
			this.indexInPath++;
			result.point.x = this.pointsInPath[this.indexInPath].x;
			result.point.y = this.pointsInPath[this.indexInPath].y;
		}

		return result;
	}

	Bogie.prototype.requestNextTrack = function () {
		var targetTrack = this.targetConnector.edge.track;
		this.snappedSegment = targetTrack.getSegmentTo(this.targetConnector.edge);

		if (this.targetConnector.edge == this.snappedSegment.connectorA) {
			//console.log("CONNECTION : GOING TO CONNECTOR B OF TRACK "+this.targetConnector.edge.track.id);
			this.snappedPosition = 0;
			this.start(this.snappedSegment.connectorB);
		}

		if (this.targetConnector.edge == this.snappedSegment.connectorB) {
			//console.log("CONNECTION : GOING TO CONNECTOR A OF TRACK "+this.targetConnector.edge.track.id);
			this.snappedPosition = config.pathPrecision;
			this.start(this.snappedSegment.connectorA);
		}
	}

	window.Bogie = Bogie;
}(window));