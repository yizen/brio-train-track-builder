var debug = new Object();
debug.showids 	= false; 
debug.magnetism	= false;
debug.connector	= false;
debug.snapTo	= false;

var maxFPS = 30;

var influenceRadiusMultiplier = 2.3;
var influenceRadiusForConnectors = 4;
var mapViewZoomLevel = 0.20;

var colors = new Object();
colors.defaultTrackFill 	= "#FFFFFF";
//colors.defaultTrackFill 	= "rgba(0,0,0,0.2)";
colors.defaultTrackStroke = "#A0998A";

colors.defaultSelectedTrackFill = "#FCF688";
colors.defaultSelectedTrackStroke = "#A0998A";

colors.defaultDialTickStoke = "rgba(0,0,0,0.2)";

colors.mapViewBackground = "rgba(255,255,255,0.4)";
colors.mapViewViewport = "rgba(11,154,211,0.4)";

colors.carMagnetPoint = "#993399";

var config = new Object();
config.pathPrecision = 10; //Discreetization of bezier and line paths, ranging from 1 to 100;
