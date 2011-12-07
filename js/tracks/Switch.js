/**
* Create a Switch
* @method Switch
* @param {Connector} sourceConnector
* @param {Array} targetConnectors
* @param {Number} position
**/

function Switch(targetConnectors, position) {
	this.targetConnectors = targetConnectors;
	this.position = 0;
};

Switch.prototype.setPosition = function (position) {
	this.position = position;	
};

Switch.prototype.getCurrentTarget = function() {
	return this.targetConnectors[this.position];
};

Switch.prototype.change = function() {
	this.position ++;
	
	if (this.position > this.targetConnectors.length-1) this.position = 0;
	console.log("Switched to position "+this.position);
	
	return this.targetConnectors[this.position];
};

