var debug = new Object();
debug.showids 	= false; 
debug.magnetism	= false;
debug.connector	= false;
debug.snapTo	= false;

/*
 * COLORS used for all drawings
 */
 
var colors = new Object();
colors.defaultTrackFill 	= "#FFFFFF";
colors.defaultTrackStroke = "#A0998A";

colors.defaultSelectedTrackFill = "#FCF688";
colors.defaultSelectedTrackStroke = "#A0998A";

colors.smallTemplateTrackFill = "#A0998A";

colors.defaultDialTickStoke = "rgba(0,0,0,0.2)";

colors.gridBackground = "#0b9ad3";
colors.gridMainLine = "#21a2d6";
colors.gridSecondaryLine = "#33aada";

colors.mapViewBackground = "rgba(255,255,255,0.4)";
colors.mapViewViewport = "rgba(11,154,211,0.4)";

colors.bogieMagnetPoint = "rgba(132,119,123,0.7)";

colors.carriageFill = "rgba(175,71,95,0.5)";
colors.carriageStroke = "#FFFFFF";

colors.arrow = "#204665";
colors.arrowHover = "#F1F3AE";

colors.tracksDrawerFill = "rgba(255,255,255,0.4)";

/*
 * CONFIG : global configuration options
 */

var config = new Object();

config.minimumLibraryVersion = 1;

config.pathPrecision = 20; //Discreetization of bezier and line paths, ranging from 1 to 100;
config.maxFPS = 30;

config.influenceRadiusMultiplier = 2.3;
config.influenceRadiusForConnectors = 4;
config.mapViewZoomLevel = 0.20;

config.gridMain = 200; // width / height of grid divisions in pixels
config.gridSecondary = 5; // number of divisions of the main grid.

config.defaultTemplate = "defaultTemplate";
config.defaultTrackStroke = 3;

config.smallTemplate = "smallTemplate";


config.useDefaultLibrary = true;
config.minimumLibraryVersion = 1;

/*
 * DEFAULT LIBRARY : library used when no network connection is available
 */
var LIBRARY = new Object();
LIBRARY.data = 
{
	"version" : "1",
	"tracks"  : [
		{
			"name" : "StraightTrack",
			/* Geometry informations */
			"regX" : "50",
			"regY" : "20",
			"influence" : "40",
			/* Connectors */
			"connectors" : [
				{
					"name" : "cA",
					"type" : "FEMALE",
					"p1"   : {
						"x" : "0",
						"y" : "0"
					},
					"p2"  : {
						"x" : "0",
						"y" : "40"
					}
				},
				{
					"name" : "cB",
					"type" : "MALE",
					"p1"   : {
						"x" : "90",
						"y" : "40"
					},
					"p2"  : {
						"x" : "90",
						"y" : "0"
					}
				}
				
			],
			/* Segments */
			"segments" : [
				{
					"type" : "LINE",
					"connectorA" : "cA",
					"connectorB" : "cB"
				}
			],
			/* Graphic */
			"graphics" : [
				{
					"op" : "startStroke"
				},
				{
					"op" : "startFill"
				},
				{
					"op" : "move",
					"x"  : "100",
					"y"  : "20"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "100", 
					"cp1y"	: "14.6", 
					"cp2x"	: "95.4", 
					"cp2y"	: "10.2", 
					"x"		: "90.0", 
					"y"		: "10.1"
				},
				{
					"op"	: "line",
					"x"		: "90",
					"y"		: "0"
				},	
				{
					"op"	: "line",
					"x"		: "0",
					"y"		: "0"
				},
				{
					"op"	: "line",
					"x"		: "0",
					"y"		: "10"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "5.4", 
					"cp1y"	: "10.2", 
					"cp2x"	: "9.8", 
					"cp2y"	: "14.6", 
					"x"		: "9.8", 
					"y"		: "20"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "9.8", 
					"cp1y"	: "25.4", 
					"cp2x"	: "5.4", 
					"cp2y"	: "29.8", 
					"x"		: "0.0", 
					"y"		: "30"
				},
				{
					"op"	: "line",
					"x"		: "0",
					"y"		: "40"
				},
				{
					"op"	: "line",
					"x"		: "90",
					"y"		: "40"
				},
				{
					"op"	: "line",
					"x"		: "90",
					"y"		: "30"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "95.4", 
					"cp1y"	: "29.8", 
					"cp2x"	: "99.8", 
					"cp2y"	: "25.4", 
					"x"		: "99.8", 
					"y"		: "20"
				}
			]
		}
	]
};