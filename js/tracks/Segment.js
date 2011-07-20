/**
* Create a Segment
* @method Segment
* @param {String} type
* @param {Point2D} cp1 for bezier curves
* @param {Point2D} cp2 for bezier curves
**/

function Segment(type, cp1, cp2) {
	if (arguments.length > 0) {
	
		if (type != "LINE" && type != "BEZIER") {
			console.error("Segment.js : unknown type "+type);
			return;
		}
		
		this.type = type;
		
		if (cp1 === undefined) cp1 = new Point2D();
		if (cp2 === undefined) cp2 = new Point2D();
		
		this.cp1 = cp1;
		this.cp2 = cp2;
	}
};

Segment.prototype.moveBy = function(dx,dy) {
	
	if (this.type == "LINE") return;

	this.cp1.rmoveto(dx, dy);
	this.cp2.rmoveto(dx, dy);
};

Segment.prototype.rotate = function(degreeAngle, pivotPoint) {

	if (this.type == "LINE") return;

	this.cp1.rotate(degreeAngle, pivotPoint);
	this.cp2.rotate(degreeAngle, pivotPoint);
};

Segment.prototype.reverse = function() {

	if (this.type == "LINE") return;

	var tmpCp = this.cp1;
	
	this.cp1 = this.cp2;
	this.cp2 = tmpCp;
};

Segment.prototype.clone = function() {
	var o = new Segment(this.type, this.cp1.clone(), this.cp2.clone());
	return o;
}