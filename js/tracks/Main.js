var stage;
var canvas;
var backgroundGrid;

var update = true;

var railroad;


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

    stage.addChild(backgroundGrid);
    
    railroad = new Railroad();
}

function createSampleObjects() {

    var maxObjects = 25;
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
}

function tick() {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stage.update();
    }
}

function setDirty() {
    update = true;
}


$(function () {
    init();
    createSampleObjects();

    Ticker.addListener(stage);

    Ticker.setFPS(maxFPS);
    
    $(window).jkey('backspace',Keys.deleteSelection);
});