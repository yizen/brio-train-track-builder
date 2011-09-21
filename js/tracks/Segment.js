/**
* Create a Segment
* @method Segment
* @param {String} type
* @param {Point2D} cp1 for bezier curves
* @param {Point2D} cp2 for bezier curves
**/

function Segment(type, connectorA, connectorB, cp1, cp2) {
	if (arguments.length > 0) {
	
		if (type != "LINE" && type != "BEZIER") {
			console.error("Segment.js : unknown type "+type);
			return;
		}
		
		this.type = type;
		
		if (cp1 === undefined) cp1 = new Point2D();
		if (cp2 === undefined) cp2 = new Point2D();
		
		this.connectorA = connectorA;
		this.connectorB = connectorB;
		
		this.cp1 = cp1;
		this.cp2 = cp2;
		
		this.previousPoint = new Point2D();
		this.angle = 0;
	}
};

Segment.prototype.setRegistrationPoint = function (regX, regY) {

	if (this.type == "LINE") return;
	
    this.cp1.rmoveto(-regX,-regY);
    this.cp2.rmoveto(-regX,-regY);
    
    this.previousPoint.x = 0;
    this.previousPoint.y = 0;		
};

Segment.prototype.moveBy = function(dx,dy) {
	
	if (this.type == "LINE") return;

	this.cp1.rmoveto(dx, dy);
	this.cp2.rmoveto(dx, dy);
};

Segment.prototype.move = function(x,y) {
	
	if (this.type == "LINE") return;

	var dx = x - this.previousPoint.x;
	var dy = y - this.previousPoint.y;
	
	this.moveBy(dx, dy);
	
	this.previousPoint.x = x;
	this.previousPoint.y = y;
};

Segment.prototype.rotate = function(angle, pivotPoint) {

	if (this.type == "LINE") return;
	
	var pivotAngle = angle - this.angle;
    this.angle = angle;

	this.cp1.rotate(pivotAngle, pivotPoint);
	this.cp2.rotate(pivotAngle, pivotPoint);
};
