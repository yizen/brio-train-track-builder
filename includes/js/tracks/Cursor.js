var Cursor = (function () {
  /* http://www.quirksmode.org/css/cursor.html */

	return {
		restore: function () {
			trackapp.canvas.style.cursor = "default";
		},
		
		pointer: function() {
			trackapp.canvas.style.cursor = "pointer";
		},
		
		move: function() {
			trackapp.canvas.style.cursor = "move";
		}
	};
})();