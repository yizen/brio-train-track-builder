/**
* A Railway represent the visual layout and connections between tracks
* @class Railway
* @extends Class
* @constructor
* @param 
**/
var Railway = Class.extend({
	/**
	* Constructor for the railway class
	* @method init
	**/
	init: function () {
		this.tracks = new Array();				//Unordered array of Tracks objects that form the railway
		this.graph = new Graph();				//Graph of all connections between the tracks.

		this.gizmo = new Gizmo();				//Visual representation the connection possibility between two tracks
		this.dragGestureConnection = new Object;//During a drag gesture, represent the best connection, illustrated by the gizmo.

		this.debugView = new Shape();
		this.selection = new Selection();
		
		this.rotationDial = new RotationDial();
 		stage.addChild(this.rotationDial);
 		
 		//Arrows to change train direction
		this.forwardArrow	= new Arrow();
		this.backwardArrow = new Arrow();
	
		stage.addChild(this.forwardArrow);
		stage.addChild(this.backwardArrow);
	},
	
	/**
	* Add a track to the railway object
	* @method addTrack
	* @param {Track} newTrack The added track to the railway
	**/
	addTrack: function (newTrack) {
		this.tracks[newTrack.id] = newTrack;

		newTrack.vertex = new Vertex(newTrack.id, {
			track: newTrack
		});
		
		this.graph.addVertex(newTrack.vertex);

		stage.addChild(newTrack);
	},
	
	/**
	* Remove a track to the railway object
	* @method removeTrack
	* @param {Track} removedTrack The added removed from the railway
	**/
	removeTrack: function (removedTrack) {
		for (var element in removedTrack.connectors) {
			stage.removeChild( removedTrack.connectors[element].shape );
			delete (removedTrack.connectors[element]);
		};		  
		
		stage.removeChild( removedTrack );
		
		var idx = this.tracks.indexOf(removedTrack); 	// Find the index
		if(idx!=-1) this.tracks.splice(idx, 1); 		// Remove it if really found!
	},

	/**
	* Move all tracks of the railway by a specific x,y distance 
	* @method moveAllTracks
	* @param {Number} dx The x delta
	* @param {Number} dy The y delta
	**/
	moveAllTracks: function (dx, dy) {
		for (var track in this.tracks) {
			this.tracks[track].moveBy(dx, dy);
		}
	},
	
	/**
	* Start tracking the drag gesture of the selection of tracks 
	* @method startDrag
	* @param {Array} selection The array of tracks IDs
	**/
	startDrag: function() {
	   	//Remove any previous connection
	   	this.dragGestureConnection.status = false;
	
		stage.addChildAt(this.gizmo, stage.getChildIndex(backgroundGrid) + 1);

		// Reset all connections of the selection
		this.disconnectAllConnector( this.selection );
		 
		// Reconnect the selection to create a solid array of tracks
		if (this.selection.length > 1) {
			this.reconnectConnectors( this.selection );		
		}
	},

	/**
	* Start tracking the magnetism possibilities of the selection of tracks 
	* @method startMagnetism
	* @param {Array} selection The array of tracks IDs
	**/
	startMagnetism: function () {	
		//Reset any previous connection
		this.dragGestureConnection.status = false;

		// Clear debug views
		if (debug.magnetism || debug.snapTo) {
			this.debugView.graphics.clear();
			stage.addChild(this.debugView);
			//stage.addChildAt(this.debugView, stage.getChildIndex(backgroundGrid)+1);
		}
		
		// Get our candidate tracks
		var neighbours = this.getNeighboursTracks( this.selection );
		
		// If no track is around, then we won't magnet anything : return.
		if (neighbours.length == 0) {
			this.gizmo.clear();
			return;
		}

		//Loop through all the possibilities of connections 
		var shortestConnectorDistance = Number.MAX_VALUE;

		for (var i=0; i<neighbours.length; i++) {		   			
			for (var j=0; j<this.selection.length; j++) {

				target = neighbours[i];
				source = this.selection[j];

				connectorMatchResult = this.getMatchingConnectors(source, target);

				//Ok, this is our best connection so far, so not it in our current connection object.
				if (connectorMatchResult.distance < shortestConnectorDistance) {
					this.dragGestureConnection.status = true;
					this.dragGestureConnection.sourceTrack = source;
					this.dragGestureConnection.targetTrack = target;
					this.dragGestureConnection.sourceConnector = connectorMatchResult.source;
					this.dragGestureConnection.targetConnector = connectorMatchResult.target;

					shortestConnectorDistance = connectorMatchResult.distance;
				}
			}
		}

		//If we're having a match, then process snap to
		if (this.dragGestureConnection.status) {
			this.gizmo.glue(this.dragGestureConnection.sourceConnector, this.dragGestureConnection.targetConnector);
		} else {
			this.gizmo.clear();
		}
	},

	/**
	* Start tracking the magnetism possibilities of the selection of tracks 
	* @method getNeighboursTracks
	* @param {Array} selection The array of tracks
	* @return {Array} An array of tracks that is close to the tracks selection passed in parameter
	**/
	getNeighboursTracks: function (selection) {
	
		//Fix an odd behaviour when in some cases a selection with a length of one is passed directy as an object.
		if (!(selection instanceof Array)) {
			var n_selection=new Selection(); 
			n_selection.add(selection); 
			selection = n_selection;
		}

		var neighbours = new Array();

		//Check all tracks
	   	for (var candidateTrackIndex in this.tracks) {		  			
			var candidateTrack = this.tracks[candidateTrackIndex];
			//Except for those in the selection wer're tracking
			if (selection.indexOf(candidateTrack) == -1) {
				//Check for all tracks in selection
				for (var trackInSelectionIndex=0; trackInSelectionIndex<selection.length; trackInSelectionIndex++) {				
					var trackInSelection = selection[trackInSelectionIndex];

					if (debug.magnetism) {
						this.debugView.graphics.beginFill("rgba(255,237,0,0.1)").drawCircle(
							trackInSelection.getCoord().x, 
							trackInSelection.getCoord().y, 
							trackInSelection.influence * config.influenceRadiusMultiplier);
					}

					//Do our two influence zone intersects ?
					//Distance between two centers
					var distanceToCenter = candidateTrack.getCoord().distanceFrom(trackInSelection.getCoord());

					//Are we in the influence area ?
					if ((distanceToCenter < ((candidateTrack.influence + trackInSelection.influence)) * config.influenceRadiusMultiplier)) {

						if (debug.magnetism) {
							this.debugView.graphics.beginFill("rgba(0,0,0,0.1)").drawCircle(
								candidateTrack.getCoord().x, 
								candidateTrack.getCoord().y, 
								candidateTrack.influence * config.influenceRadiusMultiplier);
						}

						neighbours.push(candidateTrack);
					}
				}
			}
		}

		return neighbours;
	},

	/**
	* Start tracking the magnetism possibilities of the selection of tracks 
	* @method getMatchingConnectors
	* @param {Track} source The track currently moved by the user
	* @param {Track} target The track that is considered as a target.
	* @return {Object} An object with the {Number} distance between the elected connectors, the source and target connector
	**/
	getMatchingConnectors: function (source, target) {
		var bestMatchConnectors = new Object;
		bestMatchConnectors.distance = Number.MAX_VALUE;

		//Find the two nearer connectors.
		for (var sourceConnector in source.connectors) {
			for (var targetConnector in target.connectors) {
				//Check if the two connectors can be glued together, based on their types and availability
				if (source.connectors[sourceConnector].match(target.connectors[targetConnector])) {
					
					var distance = source.connectors[sourceConnector].getDistance(target.connectors[targetConnector]);

					if (distance < bestMatchConnectors.distance) {
						bestMatchConnectors.distance = distance;
						bestMatchConnectors.source = source.connectors[sourceConnector];
						bestMatchConnectors.target = target.connectors[targetConnector];
					}
				}
			}
		}

		return bestMatchConnectors;
	},

	/**
	* Stop tracking the magnetism possibilities of the selection of tracks 
	* @method endMagnetism
	**/
	endDrag: function () {
	   		
		this.gizmo.clear();

		if (debug.magnetism || debug.snapTo) {
			this.debugView.graphics.clear();
		}

		//We're dropping out of magnetism range
		if (this.dragGestureConnection.status == false) {
			//this.dragGestureConnection.sourceConnector.edge = null; //FIXME : why ?
			this.refresh();
			return;
		}

		//Proceed to the actual move of the track
		var connectPoint = new Object;
		connectPoint.target = new Point2D();
		connectPoint.source = new Point2D();

		if (this.dragGestureConnection.sourceConnector.p1.distanceFrom(
			this.dragGestureConnection.targetConnector.p2) < this.dragGestureConnection.sourceConnector.p2.distanceFrom(this.dragGestureConnection.targetConnector.p1)) {
			connectPoint.source = this.dragGestureConnection.sourceConnector.p1;
			connectPoint.target = this.dragGestureConnection.targetConnector.p2;
		} else {
			connectPoint.source = this.dragGestureConnection.sourceConnector.p2;
			connectPoint.target = this.dragGestureConnection.targetConnector.p1;
		}

		var sourceCoord = new Point2D(this.dragGestureConnection.sourceTrack.x, this.dragGestureConnection.sourceTrack.y);

		if (debug.snapTo) {
			this.debugView.graphics.beginFill("rgba(255,255,255,0.5)").drawCircle(connectPoint.source.x, connectPoint.source.y, 10);
			this.debugView.graphics.beginFill("rgba(255,255,255,0.5)").drawCircle(connectPoint.target.x, connectPoint.target.y, 10);
		}

		var dx = connectPoint.target.x - connectPoint.source.x;
		var dy = connectPoint.target.y - connectPoint.source.y;

		if (debug.snapTo) {
			this.debugView.graphics.beginFill("rgba(255,0,255,0.5)").drawCircle(sourceCoord.x, sourceCoord.y, 20);
		}

		sourceCoord.rmoveto(dx, dy);

		if (debug.snapTo) {
			this.debugView.graphics.beginFill("rgba(255,255,0,0.5)").drawCircle(sourceCoord.x, sourceCoord.y, 20);
		}

		var targetRotation = this.dragGestureConnection.targetTrack.rotation;
		var sourceRotation = this.dragGestureConnection.sourceTrack.rotation;

		var deltaRotation = Math.round(this.getAngle(this.dragGestureConnection.sourceConnector, this.dragGestureConnection.targetConnector));

		var newSourceRotation = sourceRotation + deltaRotation;

		sourceCoord.rotate(deltaRotation, connectPoint.target);

		if (debug.snapTo) {
			this.debugView.graphics.beginFill("rgba(255,127,127,0.5)").drawCircle(sourceCoord.x, sourceCoord.y, 10);
		}

		/*			
		console.log("------------------------------------");
		console.log("Source rotation =" + this.dragGestureConnection.sourceTrack.rotation );
		console.log("Target rotation =" + this.dragGestureConnection.targetTrack.rotation);
		console.log("Delta between connectors ="+ deltaRotation);
		console.log("Applied angle to connectors = "+deltaRotation);
		console.log("New Source rotation ="+newSourceRotation);			 	
		*/	  
		
		redirectTickerToStage(true);
		
		var tween = Tween.get(this.dragGestureConnection.sourceTrack).to({
			x: sourceCoord.x,
			y: sourceCoord.y,
			rotation: newSourceRotation
	   		 }, 400)
				.call(this.dragGestureConnection.sourceTrack.move, [sourceCoord.x, sourceCoord.y])
				.call(this.dragGestureConnection.sourceTrack.rotate, [newSourceRotation])
				.call(this.snapSelectionAlong, [this.dragGestureConnection.sourceTrack, dx,dy, deltaRotation, connectPoint.target], this)
				.call(this.reconnectConnectorsWithinNeighbourhood, this.selection, this)
				.call(this.extendSelection, [this.dragGestureConnection.sourceTrack], this)
				.call(this.showRotationDial, [this.selection], this)
				.call(this.refresh)
				.call(redirectTickerToStage, [false]);  
	},
	
	snapSelectionAlong: function(sourceTrack, dx,dy, rotation, pivot) {
		for (var i=0; i<this.selection.length; i++) {
			if (this.selection[i] != sourceTrack) {
				var sourceCoord = new Point2D(this.selection[i].x, this.selection[i].y);
				sourceCoord.rmoveto(dx, dy);
				sourceCoord.rotate(rotation, pivot);
				this.selection[i].rotate(this.selection[i].rotation + rotation);
				this.selection[i].move(sourceCoord.x, sourceCoord.y);
			}
		}
	},

	/**
	* Connect to tracks at the following connectors. 
	* Note that, as this is an indirected graph, the parameter order between source / target does not matter.
	* @method connect
	* @param {Connector} sourceConnector The originating connector
	* @param {Connector} targetConnector The connected connector
	* @param {Track} sourceTrack The originating track
	* @param {Track} targetTrack The connected track
	**/
	connect: function (sourceConnector, targetConnector, sourceTrack, targetTrack) {
		sourceConnector.connectTo(targetConnector);

		this.graph.addEdge(new Edge(
		sourceTrack.id, targetTrack.id, {}));

	},
	
	/**
	* Disconnect all tracks of a selection 	
	* @method disconnectAllConnector
	* @param {Selection} selection The array of tracks
	**/
	disconnectAllConnector: function ( selection ) {
	
		for (var i=0; i<selection.length; i++) {
			
			var source = selection[i];
			source.resetConnections();
			
			//Reset graph
			var resetEdges = new Array();
			var neighbours = source.vertex.getNeighbours();

			for (var n in neighbours) {
				//Check if the neighbour is itself in the connection
				var inSelection = false;
				for (var i=0; i<selection.length; i++) {	 	
					if (selection[i].id == n) inSelection = true;
				}

				this.graph.deleteEdge(new Edge(	source.vertex.label,n, {}));
			}
		}
	},
	
	reconnectConnectorsWithinNeighbourhood: function (selection) {
		var	neighbours = railway.getNeighboursTracks(selection, railway.tracks);
		var extendedSelection = new Selection();
			 	
		extendedSelection.addArray(selection);
		extendedSelection.addArray(neighbours);
		
		railway.reconnectConnectors(extendedSelection);
		extendedSelection.clear();
	},
	
	/**
	* Reconnect all possible tracks within the selection
	* @method reconnectConnectors
	* @param {Selection} selection The array of tracks
	**/
	reconnectConnectors: function (selection) {	   	
		for (var i=0; i<selection.length; i++) {
			for (var j=0; j<selection.length; j++) {
				var source = selection[i];
				var target = selection[j];
				
				if (source.id != target.id) {
					 for (var sourceConnector in source.connectors) {
						 for (var targetConnector in target.connectors) {
							 if (source.connectors[sourceConnector].match(target.connectors[targetConnector])) {
								 if (
								 		source.connectors[sourceConnector].p1.closeTo(target.connectors[targetConnector].p2, config.influenceRadiusForConnectors) || 
								 		source.connectors[sourceConnector].p1.closeTo(target.connectors[targetConnector].p1, config.influenceRadiusForConnectors)) {
									 //Match !
									 railway.connect(source.connectors[sourceConnector], target.connectors[targetConnector], source, target);
								 }
							 }
						 }
					 }
				}
			}
		}
	},
	
	extendSelection: function(track) {
		this.selection.clear();
		
		var dps = new DepthFirstSearch(this.graph.getVertices(), track.vertex);
			
		for (var t in dps.preorder) {
			this.selection.add( this.tracks[dps.preorder[t]] ); 
		}	 
		
		setDirty();
	},

	/**
	* Calculate angle between two connectors
	* @method getAngle
	* @param {Connector} connectorA The first connector
	* @param {Connector} connectorB The second connector
	* @return {Number} The angle between the two connectors.
	**/
	getAngle: function (connectorA, connectorB) {
		// Make reference line a vector
		var Ax = connectorA.p2.x - connectorA.p1.x;
		var Ay = connectorA.p2.y - connectorA.p1.y;

		var Bx = connectorB.p1.x - connectorB.p2.x;
		var By = connectorB.p1.y - connectorB.p2.y;

		// Get the vector length
		var Alen = Math.sqrt(Ax * Ax + Ay * Ay);
		var Blen = Math.sqrt(Bx * Bx + By * By);

		// Make unit length
		// To work the coordinate system with an origin in the lower left rather than upper left corner
		// negate the y coords by adding a unary minus to rdy and dy in the division below.
		Ax = Ax / Alen;
		Ay = Ay / Alen;
		Bx = Bx / Blen;
		By = By / Blen;

		// Dot product and convert to degrees
		// To leave in radians just do: return ( Math.acos ( rdx * dx + rdy * dy ) );
		//return ( Math.acos ( rdx * dx + rdy * dy ) / 6.28 * 360 );	
		return (Math.atan2(By, Bx) - Math.atan2(Ay, Ax)) / (Math.PI * 2 / 360);
	},
	
	showRotationDial: function (selection) {
		var topmost = stage.getNumChildren();
		stage.addChildAt(this.rotationDial, topmost);
		
		this.rotationDial.selection = selection;
		this.rotationDial.show();
		Ticker.removeListener(stage);	
		Ticker.addListener(window);
   	},
   	
   	hideRotationDial: function() {
   		this.rotationDial.hide();
   	},
   	
   	hideArrows: function() {
   		redirectTickerToStage(true);

   		var tween1 = Tween.get(this.forwardArrow).to({ alpha: 0 }, 300).call(this.forwardArrow.hide, [true], this); 
   		var tween2 = Tween.get(this.backwardArrow).to({ alpha: 0 }, 300).call(this.backwardArrow.hide, [true], this)
   					      .call(redirectTickerToStage, [false]);; 
   	},
   	
   	save: function(saveToServer) {
		if (typeof saveToServer == "undefined") saveToServer = false;
		
   		var serializedRailway = {}; 
   		serializedRailway.name = this.getName();
   		serializedRailway.tracksArray = new Array()
  		
   		
		for (var savedTrackIndex in this.tracks) {					
			var savedTrack = this.tracks[savedTrackIndex];
			serializedRailway.tracksArray.push (savedTrack.serialize());
		}
		
		sessionStorage.setObject('railway', serializedRailway);
		
		
		if (saveToServer) {
			$.ajax({
  				url: "api/railwaysave",
  				dataType: 'json',
  				data: serializedRailway,
  				async: false,
  				type: 'POST',
  				success: function() { 
  					
  				},
  				error: function(request,error) {
  					console.log(error);
  				}
			});	
		
		}
   	},
   	
   	load: function(id) {
   		if (typeof id == "undefined")return;

   	},
   	
   	restore: function() {
   	
   		var allTracks = new Array();
   	
   		for (var trackIndex in this.tracks) {		  			
			allTracks.push(this.tracks[trackIndex]);
		}
		
		for (var i=allTracks.length; i>0; i--) {
			this.removeTrack(allTracks[i-1]);
		}

		railway.selection.clear();
		
		var previousRailway = sessionStorage.getObject('railway');
		
		for (var trackIndex in previousRailway.tracksArray) {
			var addedTrack = new Track(previousRailway.tracksArray[trackIndex].name);
			addedTrack.move(previousRailway.tracksArray[trackIndex].x, previousRailway.tracksArray[trackIndex].y);
			addedTrack.rotate(previousRailway.tracksArray[trackIndex].rotation);
			railway.addTrack(addedTrack);
		}
		
		this.showMeasure();
		Cursor.restore();
   	},
   	
   	measure: function() {
   		
   		var allPoints = new Array();
   		
   		var xMin = Number.MAX_VALUE;
   		var xMax = Number.MIN_VALUE;
   		
   		var yMin = Number.MAX_VALUE;
   		var yMax = Number.MIN_VALUE;
   		
   		
   		for (var trackIndex in this.tracks) {
   			var points = this.tracks[trackIndex].getAllPoints();
   			allPoints = allPoints.concat(points);
   		}
   		
   		for (var pointsIndex in allPoints) {
   			xMin = Math.min(allPoints[pointsIndex].x, xMin);
   			xMax = Math.max(allPoints[pointsIndex].x, xMax);
   			
   			yMin = Math.min(allPoints[pointsIndex].y, yMin);
   			yMax = Math.max(allPoints[pointsIndex].y, yMax);
   		}
   		
   		return { "xMin": xMin, "xMax": xMax, "yMin" : yMin, "yMax" : yMax }		
   	},
   	
   	showMeasure: function() {
   		measure.refresh();
   		measure.visible = true;
   		setDirty();
   	},
   	
   	hideMeasure: function() {
   		measure.visible = false;
   		setDirty();
   	},
   	
   	refresh: function() {
		measure.refresh();
		
		if ((typeof mapView !== "undefined") && (mapView !== null)) mapView.refresh();
   	},
   	
   	getName: function() {
   		if (typeof this.name == "undefined") {
   			this.name = "";
   		}
   		
   		return this.name;
   	},
   	
   	setName: function(name) {
   		this.name = name;
   	}
});