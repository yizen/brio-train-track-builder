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
			if (trackapp.railway.selection.length == 0) return;

			for (var i = 0; i < trackapp.railway.selection.length; i++) {
				trackapp.railway.removeTrack(trackapp.railway.selection[i]);
			}

			trackapp.railway.selection.clear();
		},

		stopTrain: function () {
			trackapp.carriage.stop();
		},

		undo: function () {
			trackapp.railway.restore();
		},
		
		saveRailway: function() {
		
			var cancelProcess = false;
			var self = this;
			
			if (trackapp.railway.getName()== "") {
				//Name not defined : show modal to prompt for railway name
				$('#track-name').on('shown', function () {
					$('#track-name-input').focus();
				});
				
				
   				$('#track-name').modal('show');
   				   				
   				$('#track-name-cancel').click(function() { self.cancelProcess = true;});
   				$('#track-name-save').click(function() {
   					$('#track-name').modal('hide');
   					trackapp.railway.setName($('#track-name-input').val());
   					trackapp.railway.save();
   					});
   			} else {
   				trackapp.railway.save();
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