var Keys = (function() {
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

    deleteSelection: function() {
    	if (railroad.selection.length == 0) return;
    	
    	for (var i=0; i<railroad.selection.length; i++) {    	
            railroad.removeTrack(railroad.selection[i]);
        }
        
        railroad.selection.clear();
    },
    
    stopTrain: function() {
    	console.log("-------------- STOP BY SPACE -----------------");
    	carriage.stop();
    }

    //this is a 'privileged' function - it can access the internal private vars
    /*
    myFunction: function() {
      return privateVar;
    }
    */
  };
})();