var debug = new Object();
debug.showids 	= false; 
debug.magnetism	= false;
debug.connector	= false;
debug.snapTo	= false;

var colors = new Object();
colors.defaultTrackFill 	= "#FFFFFF";
colors.defaultTrackStroke = "#A0998A";

colors.defaultSelectedTrackFill = "#FCF688";
colors.defaultSelectedTrackStroke = "#A0998A";

colors.defaultDialTickStoke = "rgba(0,0,0,0.2)";

colors.gridBackground = "#0b9ad3";
colors.gridMainLine = "#21a2d6";
colors.gridSecondaryLine = "#33aada";

colors.mapViewBackground = "rgba(255,255,255,0.4)";
colors.mapViewViewport = "rgba(11,154,211,0.4)";

colors.carMagnetPoint = "#993399";
colors.carMoving = "#FF00FF";

colors.arrow = "#204665";
colors.arrowHover = "#F1F3AE";

var config = new Object();
config.pathPrecision = 20; //Discreetization of bezier and line paths, ranging from 1 to 100;
config.maxFPS = 30;

config.influenceRadiusMultiplier = 2.3;
config.influenceRadiusForConnectors = 4;
config.mapViewZoomLevel = 0.20;