var trackapp = [];

function init() {
	//associate the canvas with the stage
	trackapp.canvas = document.getElementById("trackCanvas");
	trackapp.stage = new Stage(trackapp.canvas);
	Touch.enable(trackapp.stage);
	
	trackapp.update = true;
	
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	
	/*
	var retina = window.devicePixelRatio > 1 ? true : false;

	if (retina) {
		canvasWidth = canvasWidth * 2;
		canvasHeight = canvasHeight * 2;
	}
	*/
	
	trackapp.canvas.width = canvasWidth;
	trackapp.canvas.height = canvasHeight;
		
	trackapp.canvas.style.width = window.innerWidth+"px";
	trackapp.canvas.style.height = window.innerHeight+"px";

	trackapp.stage.enableMouseOver();
	trackapp.stage.snapToPixelEnabled = true;

	trackapp.backgroundGrid = new Grid(canvasWidth, canvasHeight);

	trackapp.backgroundGrid.x = canvasWidth / 2;
	trackapp.backgroundGrid.y = canvasHeight / 2;

	trackapp.mapView = new MapView(trackapp.backgroundGrid, config.mapViewZoomLevel, 300, 250);

	trackapp.stage.addChild(trackapp.backgroundGrid);
	//trackapp.stage.addChild(trackapp.mapView);

	trackapp.measure = new Measure();
	trackapp.tracksDrawer = new TracksDrawer;
	trackapp.stage.addChild(trackapp.tracksDrawer);
	trackapp.stage.addChild(trackapp.measure);
	
	trackapp.library = new Library();
	trackapp.tracksDrawer.initWithLibrary(trackapp.library);
	
	//tracksDrawer.addTemplate("ShortTrack");
	//tracksDrawer.addTemplate("LargeCurvedTrack");
	//tracksDrawer.addTemplate("CurvedSwitchingTrack");

	trackapp.railway = new Railway();
	sessionStorage.resetObject('railway');
}

function createSampleObjects() {
	/*
	var maxObjects = 10;
	var objectsArray = new Array();
	var rnd = 0;
	for (var i = 0; i < maxObjects; i++) {
		rnd = Math.floor(Math.random() * 3);

		switch (rnd) {
		case 0:
			objectsArray[i] = new Track("ShortStraightTrack");
			break;
		case 1:
			objectsArray[i] = new Track("ShortStraightTrack");
			break;
		case 2:
			objectsArray[i] = new Track("ShortStraightTrack");
			break;
		}

		railway.addTrack(objectsArray[i]);

		objectsArray[i].move((Math.floor(Math.random() * 400)), (Math.floor(Math.random() * 400)));
		objectsArray[i].rotate(Math.floor(Math.random() * 361));
	}
	*/
	
	trackapp.carriage = new Carriage();
	trackapp.carriage.move(100, 100);
	trackapp.stage.addChild(trackapp.carriage);
}

function tick() {

	if (trackapp.carriage) {
		if (trackapp.carriage.moving) {
			trackapp.carriage.tick();
		}
	}

	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (trackapp.update) {
		trackapp.update = false; // only update once
		trackapp.stage.addChild(trackapp.mapView); //keep the mapview on top
		trackapp.mapView.refresh();

		trackapp.stage.update();
	}
}

function setDirty() {
	trackapp.update = true;
}

function redirectTickerToStage(value) {
	if (value) {
		Ticker.removeListener(window);
		Ticker.addListener(trackapp.stage);
	} else {
		Ticker.removeListener(trackapp.stage);
		Ticker.addListener(window);
	}
}


$(function () {
	init();
	
	if (typeof loadedRailwayId == "undefined") {
		//If we have no railway to load, throw optionnaly new objects on the canvas.
		createSampleObjects();
	} else {
		trackapp.railway.load(loadedRailwayId);
	}
	
	Ticker.addListener(window);
	Ticker.setFPS(config.maxFPS);

	$(window).jkey('backspace', Keys.deleteSelection);
	$(window).jkey('space', Keys.stopTrain);
	$(window).jkey('ctrl+z', Keys.undo);
	$(window).jkey('ctrl+s', Keys.saveRailway);
	
	//Prevent the text selection cursor to appear on drag.
	$("#trackCanvas").each(function() {
      this.onselectstart = function() { return false; };
    });
});