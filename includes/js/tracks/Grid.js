(function (window) {

	function Grid(visibleWidth, visibleHeight) {
		this.type = "Grid";

		this.visibleWidth = visibleWidth;
		this.visibleHeight = visibleHeight;

		this.width = this.visibleWidth + (2 * config.gridMain);
		this.height = this.visibleHeight + (2 * config.gridMain);

		this.absoluteX = 0;
		this.absoluteY = 0;

		this.initialize();
	}

	Grid.prototype = new Shape();
	Grid.prototype.Shape_initialize = Grid.prototype.initialize; //unique to avoid overriding base class
	// constructor:
	Grid.prototype.initialize = function () {
		this.Shape_initialize();
		this.snapToPixel = true;

		this.regX = this.width / 2;
		this.regY = this.height / 2;

		this.x = -config.gridMain;
		this.y = -config.gridMain;

		this.makeShape();
		this.clickWasADrag = false;
	}

	Grid.prototype.onPress = function (evt) {

		railway.hideRotationDial();
		railway.hideMeasure();
		Cursor.move();

		this.dx = this.x;
		this.dy = this.y;

		var offset = {
			x: this.x - evt.stageX,
			y: this.y - evt.stageY
		};

		var grid = this;
		this.clickWasADrag = false;
		// add a handler to the event object's onMouseMove callback
		// this will be active until the user releases the mouse button:
		evt.onMouseMove = function (ev) {
			var x = ev.stageX + offset.x;
			var y = ev.stageY + offset.y;

			grid.move(x, y);
			grid.clickWasADrag = true;
			// indicate that the stage should be updated on the next tick:
			setDirty();
		};

		evt.onMouseUp = function (ev) {
			railway.showMeasure();
			railway.refresh();
			Cursor.restore();
			setDirty();

			if (!grid.clickWasADrag) {
				//clear selection
				railway.selection.reset();
			}
		}
	}

	Grid.prototype.move = function (x, y) {

		var displaceX = x - this.dx;
		var displaceY = y - this.dy;

		this.dx = x;
		this.dy = y;

		this.absoluteX += displaceX;
		this.absoluteY += displaceY;

		//FIXME : we should move all objects
		railway.moveAllTracks(displaceX, displaceY);


		this.x = this.absoluteX % config.gridMain + this.regX - config.gridMain;
		this.y = this.absoluteY % config.gridMain + this.regY - config.gridMain;

	}

	Grid.prototype.makeShape = function () {
		var g = this.graphics;

		g.clear();
		g.beginFill(colors.gridBackground);
		//Set the main rectangle
		g.rect(0, 0, this.width, this.height);

		//Vertical grid
		for (var i = 0; i < this.width; i += (config.gridMain / config.gridSecondary)) {
			g.setStrokeStyle(1);

			(i % config.gridMain) ? color = colors.gridMainLine : color = colors.gridSecondaryLine;

			g.beginStroke(color);
			g.moveTo(i, 0).lineTo(i, this.height);
		}

		for (var j = 0; j < this.height; j += (config.gridMain / config.gridSecondary)) {
			g.setStrokeStyle(1);

			(j % config.gridMain) ? color = colors.gridMainLine : color = colors.gridSecondaryLine;

			g.beginStroke(color);
			g.moveTo(0, j).lineTo(this.width, j);
		}

		this.cache(0, 0, this.width, this.height);
	}

	Grid.prototype.resetView = function () {
		this.dx = this.visibleWidth / 2;
		this.dy = this.visibleHeight / 2;

		this.move(this.dx - this.absoluteX, this.dy - this.absoluteY);
		setDirty();
	}

	Grid.prototype.onDoubleClick = function (ev) {
		this.resetView();
	}

	Grid.prototype.absolutizePoint = function (point) {
		var newPoint = new Point2D();

		newPoint.x = point.x - this.absoluteX;
		newPoint.y = point.y - this.absoluteY;

		return newPoint;
	}

	window.Grid = Grid;
}(window));