var Keys = (function () {
  //these are only accessible internally
  /*
  var privateVar = 'this is private';
  var privateFunction = function() {
    return "this is also private";
  };
  */

	return {
		//these can be accessed externally
		//publicVar: 'this is public',
		deleteSelection: function () {
			if (railway.selection.length == 0) return;

			for (var i = 0; i < railway.selection.length; i++) {
				railway.removeTrack(railway.selection[i]);
			}

			railway.selection.clear();
		},

		stopTrain: function () {
			carriage.stop();
		},

		undo: function () {
			railway.restore();
		},
		
		saveRailway: function() {
		
			var cancelProcess = false;
			var self = this;
			
			if (railway.getName()== "") {
				//Name not defined : show modal to prompt for railway name
   				$('#track-name').modal('show');
   				$('#track-name-cancel').click(function() { self.cancelProcess = true;});
   				$('#track-name-save').click(function() {
   					$('#track-name').modal('hide');
   					railway.setName($('#track-name-input').val());
   					railway.save(true);
   					
   					});
   			} else {
   				railway.save(true);
   				
   			}
   		}

		//this is a 'privileged' function - it can access the internal private vars
	/*
    myFunction: function() {
      return privateVar;
    }
    */
	};
})();