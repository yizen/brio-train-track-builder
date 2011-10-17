var stage;
var canvas;
var backgroundGrid;
var mapView;

var update = true;

var railroad;
var carriage = new Carriage();

function init() {
    //associate the canvas with the stage
    canvas = document.getElementById("trackCanvas");
    stage = new Stage(canvas);

	var canvasWidth  = window.innerWidth;
  	var canvasHeight = window.innerHeight;
  	
  	canvas.width = canvasWidth;
  	canvas.height = canvasHeight;
    
    stage.enableMouseOver();
    stage.snapToPixelEnabled = true;

    backgroundGrid = new Grid(canvasWidth * 2, canvasHeight * 2);
    backgroundGrid.x = canvasWidth/2 ;
    backgroundGrid.y = canvasHeight/2;
    
    mapView = new MapView(backgroundGrid, config.mapViewZoomLevel);
    
    //mapView.height = 100;
    //mapView.width  = 200;
    mapView.x = canvasWidth  - mapView.width;
    mapView.y = canvasHeight - mapView.height;

    stage.addChild(backgroundGrid);
    stage.addChild(mapView);
    
    railroad = new Railroad();
}

function createSampleObjects() {

    var maxObjects = 5;
    var objectsArray = new Array();
    var rnd = 0;
    for (var i = 0; i < maxObjects; i++) {
        rnd = Math.floor(Math.random() * 3);

       switch (rnd) {
       	case 0:
       		objectsArray[i] = new StraightTrack();
       		break;
       	case 1:
            objectsArray[i] = new CurvedTrack();
            break;
        case 2:
        	objectsArray[i] = new TripleTrack();
            break;
        }

        railroad.addTrack(objectsArray[i]);

        objectsArray[i].move((Math.floor(Math.random() * 400)), (Math.floor(Math.random() * 400)));
        objectsArray[i].rotate(Math.floor(Math.random() * 361));
    }
    
    carriage.move(100,100);
    stage.addChild(carriage);

}

function tick() {
    
    if (carriage) {
    	if (carriage.moving) {
			carriage.tick();
    	}
    }
    
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        
        stage.addChild(mapView); //keep the mapview on top
        mapView.refresh();
        
        stage.update();
    }
}

function setDirty() {
    update = true;
}

function redirectTickerToStage ( value ) {
	if (value) {
		Ticker.removeListener(window);	
		Ticker.addListener(stage);
	} else {
		Ticker.removeListener(stage);	
		Ticker.addListener(window);
	}
}


$(function () {
    init();
    createSampleObjects();

    Ticker.addListener(window);
    Ticker.setFPS(config.maxFPS);
    
    $(window).jkey('backspace',Keys.deleteSelection);
    $(window).jkey('space', Keys.stopTrain);
});