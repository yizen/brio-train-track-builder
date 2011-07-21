(function(window) {

	function Selection() {		
  		var arr = [ ];
  		arr.push.apply(arr, arguments);
  		arr.__proto__ = Selection.prototype;
  		return arr;
  		
  		/* http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/ */
	}
	
	Selection.prototype = new Array;

    Selection.prototype.add = function (tracks) {
    	if (typeof(tracks)=="array") {
    		this.addArray(tracks);
    	} else {
    		this.addOne(tracks);
    	}
    }

    Selection.prototype.addOne = function (track) {
        if (track === undefined) return; //this might happen after deleting a selection
    	if (this.indexOf((track)) !== -1)  return; //Track already exists.	    	

    	this.push(track);
    	track.setSelection(true);
    }
    
    Selection.prototype.addArray = function (tracksArray) {
    
    	//Fix an odd behaviour when in some cases a selection with a length of one is passed directy as an object.
    	if (!(tracksArray instanceof Array)) {
    		n_tracksArray=new Array(); 
    		n_tracksArray.push(tracksArray);
    		tracksArray = n_tracksArray;
    	}
    	
    	for (var track in tracksArray) {
    		this.add(tracksArray[track]);
    	}
    }
    
    Selection.prototype.set = function(tracksArray) {
    	for (var track in tracksArray) {
    		if (this.selection.indexOf(tracksArray[track]) == -1) {
    			this.add(tracksArray[track]);
    		} else {
    			this.remove(tracksArray[track]);
    		}
    	}
    }
    
    Selection.prototype.remove = function (track) {
    	track.setSelection(false);
    	
    	var idx = this.indexOf(track); // Find the index
		if(idx!=-1) this.splice(idx, 1); // Remove it if really found!
    }
    
    Selection.prototype.reset = function() {
    	for(var i = this.length-1; i >= 0; i--){ 
    		this.remove(this[i]);
		}
    }
    
    Selection.prototype.clear = function() {
    	this.reset();
    	railroad.rotationDial.hide();
    }
    
    
    Selection.prototype.rebuildConnections = function() {
    
    }
    
    Selection.prototype.removeConnections = function() {
    
    }
    
    Selection.prototype.getCenter = function() {
    	var center = new Point2D();
    	var x_sum = 0;
    	var y_sum = 0;
    
    	for (var i=0; i<this.length; i++) {    	
            x_sum += (/* this[i].regX + */ this[i].x);
            y_sum += (/* this[i].regY +  */this[i].y);
        }
        
        center.x = x_sum / this.length;
        center.y = y_sum / this.length;
        
        return center;
    }
    
    /**
	* Move all tracks of the selection by a specific x,y distance 
	* @method move
	* @param {Number} dx The x delta
	* @param {Number} dy The y delta
	**/
    Selection.prototype.move = function (dx, dy) { 
    	for (var i=0; i<this.length; i++) {    	
            this[i].moveBy(dx, dy);
        }
    }
    
    Selection.prototype.rotate = function (angle, center) {
    
    
    }
    
window.Selection = Selection;    
}(window));