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
			"name" : "ShortStraightTrack",
			"vendor" : "BRIO",
			"reference" : "33334",
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
		},
		{
			"name" : "LargeCurvedTrack",
			"vendor" : "BRIO",
			"reference" : "33342",
			/* Geometry informations */
			"regX" : "88",
			"regY" : "23",
			"influence" : "50",
			/* Connectors */
			"connectors" : [
				{
					"name" : "cA",
					"type" : "MALE",
					"p1"   : {
						"x" : "0",
						"y" : "36.7"
					},
					"p2"  : {
						"x" : "28",
						"y" : "65"
					}
				},
				{
					"name" : "cB",
					"type" : "FEMALE",
					"p1"   : {
						"x" : "148",
						"y" : "65"
					},
					"p2"  : {
						"x" : "176",
						"y" : "37"
					}
				}
				
			],
			/* Segments */
			"segments" : [
				{
					"type" : "BEZIER",
					"connectorA" : "cA",
					"connectorB" : "cB",
					"cp1" : {
						"x" : "67.6",
						"y" : "9"
					},
					"cp2" : {
						"x" : "112.9",
						"y" : "9"
					}
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
					"x"  : "152.5",
					"y"  : "50.4"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "152.5", 
					"cp1y"	: "44.9", 
					"cp2x"	: "157.0", 
					"cp2y"	: "40.4", 
					"x"		: "162.5", 
					"y"		: "40.4"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "165.3", 
					"cp1y"	: "40.4", 
					"cp2x"	: "167.9", 
					"cp2y"	: "41.6", 
					"x"		: "169.7", 
					"y"		: "43.4"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "171.9", 
					"cp1y"	: "41.2", 
					"cp2x"	: "174.1", 
					"cp2y"	: "39.0", 
					"x"		: "176.3", 
					"y"		: "36.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "176.4", 
					"cp1y"	: "36.8", 
					"cp2x"	: "176.5", 
					"cp2y"	: "36.7", 
					"x"		: "176.6", 
					"y"		: "36.6"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "127.8", 
					"cp1y"	: "-12.2", 
					"cp2x"	: "48.8", 
					"cp2y"	: "-12.2", 
					"x"		: "0.0", 
					"y"		: "36.6"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "2.4", 
					"cp1y"	: "39.0", 
					"cp2x"	: "4.8", 
					"cp2y"	: "41.4", 
					"x"		: "7.2", 
					"y"		: "43.8"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "5.4", 
					"cp1y"	: "45.6", 
					"cp2x"	: "4.3", 
					"cp2y"	: "48.1", 
					"x"		: "4.3", 
					"y"		: "50.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "4.3", 
					"cp1y"	: "56.4", 
					"cp2x"	: "8.8", 
					"cp2y"	: "60.9", 
					"x"		: "14.3", 
					"y"		: "60.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "17.1", 
					"cp1y"	: "60.9", 
					"cp2x"	: "19.6", 
					"cp2y"	: "59.7", 
					"x"		: "21.4", 
					"y"		: "57.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "23.7", 
					"cp1y"	: "60.2", 
					"cp2x"	: "26.0", 
					"cp2y"	: "62.5", 
					"x"		: "28.3", 
					"y"		: "64.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "61.4", 
					"cp1y"	: "31.7", 
					"cp2x"	: "115.1", 
					"cp2y"	: "31.7", 
					"x"		: "148.3", 
					"y"		: "64.9"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "150.7", 
					"cp1y"	: "62.4", 
					"cp2x"	: "153.1", 
					"cp2y"	: "60.0", 
					"x"		: "155.6", 
					"y"		: "57.6"
				},
				{
					"op" 	: "bezier",
					"cp1x" 	: "153.7", 
					"cp1y"	: "55.7", 
					"cp2x"	: "152.5", 
					"cp2y"	: "53.2", 
					"x"		: "152.5", 
					"y"		: "50.4"
				}
			]
		}
	]
};