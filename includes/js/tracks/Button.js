(function (window) {

	function Button(normal, hover, pressed) {
		this.type = "Button";
		this.normal = normal;
		this.hover = hover || normal;
		this.pressed = pressed || normal;
		
		this.initialize();
	}

	Button.prototype = new Container();
	Button.prototype.Container_initialize = Button.prototype.initialize;

	//constructor
	Button.prototype.initialize = function () {
		this.Container_initialize();
		this.visible = false;
				
		this.normalState = new Bitmap(this.normal);
		this.hoverState = new Bitmap(this.hover);
		this.pressedState = new Bitmap(this.pressed);
		
		this.normalState.visible = true;
		this.hoverState.visible = false;
		this.pressedState.visible = false;
		
		this.addChild(this.normalState);
		this.addChild(this.hoverState);
		this.addChild(this.pressedState);
	}

	Button.prototype.show = function () {
		var topmost = this.parent.getNumChildren();
		this.parent.addChildAt(this, topmost);
		this.visible = true;
		setDirty();
	}

	Button.prototype.hide = function () {
		this.visible = false;
		setDirty();
	}

	Button.prototype.onPress = function (evt) {
		this.normalState.visible = false;
		this.hoverState.visible = false;
		this.pressedState.visible = true;
		
		var button = this; 
		
		setDirty();
		
		// add a handler to the event object's onMouseMove callback
		// this will be active until the user releases the mouse button:
		evt.onMouseMove = function (ev) {
		
			//TODO : check if we're still with the bounds of the button
			button.normalState.visible = false;
			button.hoverState.visible = false;
			button.pressedState.visible = true;

			// indicate that the stage should be updated on the next tick:
			setDirty();
		};
		
		evt.onMouseUp = function (ev) {
			button.normalState.visible = true;
			button.hoverState.visible = false;
			button.pressedState.visible = false;
			
			//TODO : check if we're still with the bounds of the button
			//Call the cliked event.
			button.whenClicked();

			setDirty();
		}
	}


	Button.prototype.onMouseOver = function () {
		this.normalState.visible = false;
		this.hoverState.visible = true;
		this.pressedState.visible = false;
		setDirty();
	}

	Button.prototype.onMouseOut = function () {
		this.normalState.visible = true;
		this.hoverState.visible = false;
		this.pressedState.visible = false;
		setDirty();
	}
	
	Button.prototype.whenClicked = function() {
	
	}

	window.Button = Button;
}(window));