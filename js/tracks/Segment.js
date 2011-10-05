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

Segment.prototype.getStartPoint = function() {
	return this.connectorA.getCenter();
}

Segment.prototype.getEndPoint = function() {
	return this.connectorB.getCenter();
} 

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

Segment.prototype.hasConnectors = function(c1, c2) {
	if ((c1 == this.connectorA) && (c2 == this.connectorB)) return true;
	if ((c2 == this.connectorA) && (c1 == this.connectorB)) return true;
	return false;
};

Segment.prototype.getPoints = function(points, reverse) {

	if (points === undefined) var points = new Array();
	if (reverse === undefined) var reverse = false;
    
    var startPoint = new Point2D();
    var endPoint   = new Point2D(); 
    var cp1 = new Point2D();
    var cp2 = new Point2D();

	if (!reverse) {
		startPoint = this.connectorA.getCenter();
		endPoint   = this.connectorB.getCenter();
		cp1 = this.cp1;
		cp2 = this.cp2;
	} else {
		startPoint = this.connectorB.getCenter();
		endPoint   = this.connectorA.getCenter();
		cp1 = this.cp2;
		cp2 = this.cp1;
	}
	
    var discreetPath = new Path();
    				
    if (this.type == "BEZIER") {
    	discreetPath.addBezier([ 	startPoint,
    								cp1,
    								cp2,
    								endPoint ]);
    }
    				
    if (this.type == "LINE") {
    	discreetPath.addLine(	startPoint,
    							endPoint );
    				
    }
    				
    for (var i=0; i<100; i += (100/config.pathPrecision)) {
    	var p = discreetPath.atT(i/100);
    	p.segment = this;
    	p.position = config.pathPrecision * i/100 ;
    	points.push(p);
    }
    	    	    	
    return points;
}