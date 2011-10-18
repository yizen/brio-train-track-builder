/*
* SimpleMaskContainer by Charles T Wall III. September 27, 2011
*
* Copyright (c) 2011 Modea written by Charles T Wall III
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
* The Easel Javascript library provides a retained graphics mode for canvas 
* including a full, hierarchical display list, a core interaction model, and 
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/

(function(window) {
    SimpleMaskContainer = function(){
        this.initialize();
    }

    var p = SimpleMaskContainer.prototype = new Container(); 
    
    /* temporary canvas for rendering and masking children
     * children are rendered here first then a cutout of this 
     * image is copied to the stage.  
    **/
    p.canvas = null;
    
    /* Rectangle {x, y, width, height}
     * The rectangle to mask this objects children to.
    **/
    p.rectangleMask = null;
    
	/**
	* Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at 
	* the specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all 
	* transform properties including regX/Y.
	* @method hitTest
	* @param {Number} x The x position to check in the display object's local coordinates.
	* @param {Number} y The y position to check in the display object's local coordinates.
	* @return {Boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified 
	* local Point.
	*/
    p._hitTestMask = function(x, y){
        var rect = this.rectangleMask;
        if( !rect || (x > rect.x 
                    && y > rect.y 
                    && x < rect.x + rect.width
                    && y < rect.y + rect.height)) {
            return true;
        } else {
            return false;
        }
    }
        
// private properties:
	/** 
	* @method _getObjectsUnderPoint
	* @param {Number} x
	* @param {Number} y
	* @param {Array} arr
	* @param {Number} mouseEvents A bitmask indicating which mouseEvent types to look for. Bit 1 specifies onPress & 
	* onClick, bit 2 specifies it should look for onMouseOver and onMouseOut. This implementation may change.
	* @return {Array[DisplayObject]}
	* @protected
	**/
    p.Container_getObjectsUnderPoint = p._getObjectsUnderPoint;
    //override _getObjectsUnderPoint()
    p._getObjectsUnderPoint = function(x, y, arr, mouseEvents){
        if(this._hitTestMask(x, y)){
            return this.Container_getObjectsUnderPoint(x, y, arr, mouseEvents);
        } else {
            return null
        }        
    }
    
    /**
	* Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	* Returns true if the draw was handled (useful for overriding functionality).
	* NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	* @method draw
	* @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	* @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
	* For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	* into itself).
	**/
    p.Container_draw = p.draw;
    //override Container.draw()
    p.draw = function(ctx, ignoreCache, _mtx){
        var mask = this.rectangleMask;
		var snap = Stage._snapToPixelEnabled;
        var mtx;
		if (!_mtx) {
			mtx = new Matrix2D();
			mtx.appendProperties(this.alpha, this.shadow, this.compositeOperation);
		} else {
            mtx = _mtx.clone();
        }
        if(mask){
            if(!this.canvas){
                this.canvas = document.createElement('canvas');
            }
            this.canvas.width = mask.width;
            this.canvas.height = mask.height;
            var maskContext = this.canvas.getContext("2d");
            var maskMTX = new Matrix2D();
            maskMTX.translate(-mask.x, -mask.y);
            this.Container_draw(maskContext, ignoreCache, maskMTX);
            var maskedContent = new Bitmap();
            maskedContent.image = this.canvas;
            if (snap && maskedContent.snapToPixel && mtx.a == 1 && mtx.b == 0 && mtx.c == 0 && mtx.d == 1) {
                ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0);
            } else {
                ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            }
            ctx.translate(mask.x, mask.y);
            maskedContent.draw(ctx, false, mtx.clone());
        } else {
            this.Container_draw(ctx, ignoreCache, mtx.clone());
        }      
        return true;
    }
})(window)

