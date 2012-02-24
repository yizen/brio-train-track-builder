/*****
*
*   Point2D.js
*
*   copyright 2001-2002, Kevin Lindsey
*
*****/

/*****
*
*   Point2D
*
*****/

/*****
*
*   constructor
*
*****/
function Point2D(x, y) {
    if ( arguments.length > 0 ) {
        this.x = x;
        this.y = y;
    }
}


/*****
*
*   clone
*
*****/
Point2D.prototype.clone = function() {
    return new Point2D(this.x, this.y);
};


/*****
*
*   add
*
*****/
Point2D.prototype.add = function(that) {
    return new Point2D(this.x+that.x, this.y+that.y);
};


/*****
*
*   addEquals
*
*****/
Point2D.prototype.addEquals = function(that) {
    this.x += that.x;
    this.y += that.y;

    return this;
};


/*****
*
*   offset - used in dom_graph
*
*   This method is based on code written by Walter Korman
*      http://www.go2net.com/internet/deep/1997/05/07/body.html 
*   which is in turn based on an algorithm by Sven Moen
*
*****/
Point2D.prototype.offset = function(a, b) {
    var result = 0;

    if ( !( b.x <= this.x || this.x + a.x <= 0 ) ) {
        var t = b.x * a.y - a.x * b.y;
        var s;
        var d;

        if ( t > 0 ) {
            if ( this.x < 0 ) {
                s = this.x * a.y;
                d = s / a.x - this.y;
            } else if ( this.x > 0 ) {
                s = this.x * b.y;
                d = s / b.x - this.y
            } else {
                d = -this.y;
            }
        } else {
            if ( b.x < this.x + a.x ) {
                s = ( b.x - this.x ) * a.y;
                d = b.y - (this.y + s / a.x);
            } else if ( b.x > this.x + a.x ) {
                s = (a.x + this.x) * b.y;
                d = s / b.x - (this.y + a.y);
            } else {
                d = b.y - (this.y + a.y);
            }
        }

        if ( d > 0 ) {
            result = d;
        }
    }

    return result;
};


/*****
*
*   rmoveto
*
*****/
Point2D.prototype.rmoveto = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};


/*****
*
*   scalarAdd
*
*****/
Point2D.prototype.scalarAdd = function(scalar) {
    return new Point2D(this.x+scalar, this.y+scalar);
};


/*****
*
*   scalarAddEquals
*
*****/
Point2D.prototype.scalarAddEquals = function(scalar) {
    this.x += scalar;
    this.y += scalar;

    return this;
};


/*****
*
*   subtract
*
*****/
Point2D.prototype.subtract = function(that) {
    return new Point2D(this.x-that.x, this.y-that.y);
};


/*****
*
*   subtractEquals
*
*****/
Point2D.prototype.subtractEquals = function(that) {
    this.x -= that.x;
    this.y -= that.y;

    return this;
};


/*****
*
*   scalarSubtract
*
*****/
Point2D.prototype.scalarSubtract = function(scalar) {
    return new Point2D(this.x-scalar, this.y-scalar);
};


/*****
*
*   scalarSubtractEquals
*
*****/
Point2D.prototype.scalarSubtractEquals = function(scalar) {
    this.x -= scalar;
    this.y -= scalar;

    return this;
};


/*****
*
*   multiply
*
*****/
Point2D.prototype.multiply = function(scalar) {
    return new Point2D(this.x*scalar, this.y*scalar);
};


/*****
*
*   multiplyEquals
*
*****/
Point2D.prototype.multiplyEquals = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
};


/*****
*
*   divide
*
*****/
Point2D.prototype.divide = function(scalar) {
    return new Point2D(this.x/scalar, this.y/scalar);
};


/*****
*
*   divideEquals
*
*****/
Point2D.prototype.divideEquals = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;

    return this;
};


/*****
*
*   comparison methods
*
*   these were a nice idea, but ...  It would be better to define these names
*   in two parts so that the first part is the x comparison and the second is
*   the y.  For example, to test p1.x < p2.x and p1.y >= p2.y, you would call
*   p1.lt_gte(p2).  Honestly, I only did these types of comparisons in one
*   Intersection routine, so these probably could be removed.
*
*****/

/*****
*
*   compare
*
*****/
Point2D.prototype.compare = function(that) {
    return (this.x - that.x || this.y - that.y);
};


/*****
*
*   eq - equal
*
*****/
Point2D.prototype.eq = function(that) {
    return ( this.x == that.x && this.y == that.y );
};


/*****
*
*   lt - less than
*
*****/
Point2D.prototype.lt = function(that) {
    return ( this.x < that.x && this.y < that.y );
};


/*****
*
*   lte - less than or equal
*
*****/
Point2D.prototype.lte = function(that) {
    return ( this.x <= that.x && this.y <= that.y );
};


/*****
*
*   gt - greater than
*
*****/
Point2D.prototype.gt = function(that) {
    return ( this.x > that.x && this.y > that.y );
};


/*****
*
*   gte - greater than or equal
*
*****/
Point2D.prototype.gte = function(that) {
    return ( this.x >= that.x && this.y >= that.y );
};


/*****
*
*   utility methods
*
*****/

/*****
*
*   lerp
*
*****/
Point2D.prototype.lerp = function(that, t) {
    return new Point2D(
        this.x + (that.x - this.x) * t,
        this.y + (that.y - this.y) * t
    );
};


/*****
*
*   distanceFrom
*
*****/
Point2D.prototype.distanceFrom = function(that) {
    var dx = this.x - that.x;
    var dy = this.y - that.y;

    return Math.sqrt(dx*dx + dy*dy);
};


/*****
*
*   min
*
*****/
Point2D.prototype.min = function(that) {
    return new Point2D(
        Math.min( this.x, that.x ),
        Math.min( this.y, that.y )
    );
};


/*****
*
*   max
*
*****/
Point2D.prototype.max = function(that) {
    return new Point2D(
        Math.max( this.x, that.x ),
        Math.max( this.y, that.y )
    );
};


/*****
*
*   toString
*
*****/
Point2D.prototype.toString = function() {
    return this.x + "," + this.y;
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   setXY
*
*****/
Point2D.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
};


/*****
*
*   setFromPoint
*
*****/
Point2D.prototype.setFromPoint = function(that) {
    this.x = that.x;
    this.y = that.y;
};


/*****
*
*   swap
*
*****/
Point2D.prototype.swap = function(that) {
    var x = this.x;
    var y = this.y;

    this.x = that.x;
    this.y = that.y;

    that.x = x;
    that.y = y;
};


/*
 * Additions by Olivier Grenet
 *
 * Rotate
 *
*/

Point2D.prototype.rotate = function(degreeAngle, pivotPoint) {
	var radiantsAngle = Math.PI / 180 * (+ degreeAngle || 0);

    this.x = this.x - pivotPoint.x; // Shift to origin
    this.y = this.y - pivotPoint.y;

    var xx = this.x * Math.cos(radiantsAngle) - this.y * Math.sin(radiantsAngle); // Rotate
    var yy = this.x * Math.sin(radiantsAngle) + this.y * Math.cos(radiantsAngle);

    this.x = xx + pivotPoint.x; // Shift to origin
    this.y = yy + pivotPoint.y;
};

/*
 * Close To
 */
Point2D.prototype.closeTo = function(that, margin) {
    return ( Math.abs(this.x - that.x) < margin && Math.abs(this.y - that.y) < margin );
};

/*
 * Get Angle
 */
Point2D.prototype.getAngle = function (origin, target) {
   		
		//Create Vectors
		var vectorA = new Object;
		vectorA.p1 = new Point2D(this.x, this.y);
		vectorA.p2 = new Point2D(origin.x, origin.y);
		
		var vectorB = new Object;
		vectorB.p1 = new Point2D(this.x, this.y);
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
};

/*
 * Get Line to
 */
Point2D.prototype.getLineTo = function (target) {

		if (this.x == target.x) {
			var a = 1;
			var b = 0;
			var c = -this.x;
		} else {
			var a = target.y - this.y;
        	var b = this.x - target.x;
        	var c = this.y * target.x - this.x * target.y;
        }
        
        if(a < 0) {
                a = -a;
                b = -b;
                c = -c;
        }
        
        var angle;
        
        if(a == 0) {
        	angle = 0;
        } 
        else {
        	if(b == 0) {
        		angle =  Math.PI / 2;
        	} 
        	else {
	        	var tan = - a / b;
	        	if(tan > 0)
	        	{
	                angle = Math.atan(tan);
	        	}
	        	else
	        	{
	                angle = Math.atan(tan) + Math.PI;
	        	}
	        }
        }
        
        angle = angle * (180/Math.PI);
        
        return ({"a":a, "b":b, "c":c, "angle":angle});
};
 
/* 
 * Mirror / Symmetry 
 */

Point2D.prototype.mirror = function(line) {
		var d = line.a * line.a + line.b * line.b;
        var x = (this.x * (line.b * line.b - line.a * line.a) - 2 * line.a *line.b * this.y - 2 * line.a * line.c) / d;
        var y = (this.y * (line.a * line.a - line.b * line.b) - 2 * line.a *line.b * this.x - 2 * line.b * line.c) / d;
        return new Point2D(x,y);
};

/*
 * Perpendicular
 */
Point2D.prototype.perpendicular = function(line) {
	var a = line.b;
	var b = -line.a;
	var c = line.a * this.y - line.b * this.x;

	var angle;
        
    if(a == 0) {
    	angle = 0;
    } 
    else {
    	if(b == 0) {
    		angle =  Math.PI / 2;
    	} 
    	else {
        	var tan = - a / b;
        	if(tan > 0)
        	{
                angle = Math.atan(tan);
        	}
        	else
        	{
                angle = Math.atan(tan) + Math.PI;
        	}
        }
    }
    
    angle = angle * (180/Math.PI);

    return ({"a":a, "b":b, "c":c, "angle":angle});
};

/*
 * Intersect
 */
Point2D.prototype.intersect = function(line0,line1) {
        var d = line0.a * line1.b - line1.a * line0.b;
        
        if(Math.abs(d) <= 0) {
                return false;
        } else {
      		this.x = (line0.b * line1.c - line0.c * line1.b) / d;
            this.y = (line0.c * line1.a - line0.a * line1.c) / d;
            return true;
        }
}