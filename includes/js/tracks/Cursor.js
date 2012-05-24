var Cursor = (function () {
  /* http://www.quirksmode.org/css/cursor.html */

	return {
		restore: function () {
			canvas.style.cursor = "default";
		},
		
		pointer: function() {
			canvas.style.cursor = "pointer";
		},
		
		move: function() {
			canvas.style.cursor = "move";
		}
	};
})();