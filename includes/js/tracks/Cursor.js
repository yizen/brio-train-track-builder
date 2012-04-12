var Cursor = (function () {
  /* http://www.quirksmode.org/css/cursor.html */

	return {
		restore: function () {
			console.log("restore");
			canvas.style.cursor = "default";
		},
		
		pointer: function() {
			canvas.style.cursor = "pointer";
		},
		
		move: function() {
			console.log("move");
			canvas.style.cursor = "move";
		}
	};
})();