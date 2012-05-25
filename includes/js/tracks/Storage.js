/* http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage */

Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	
	if (value === undefined) return null;
	if (value == "undefined") return null;

	
	return value && JSON.parse(value);
}

Storage.prototype.resetObject = function(key) {
	this.removeItem(key);
}