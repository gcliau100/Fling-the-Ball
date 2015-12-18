var mouse = {
	x: null,
	y: null
};

var cursorDown = {
	x: null,
	y: null,
	time: null
};

var cursorUp = {
	x: null,
	y: null,
	time: null
};

canvas.addEventListener("mousemove", function(event) {
	mouse.x = event.layerX;
	mouse.y = event.layerY;
}, false);

canvas.addEventListener("mousedown", function() {
	cursorDown.x = mouse.x;
	cursorDown.y = mouse.y;
	cursorDownHandler();
}, false);

canvas.addEventListener("touchstart", function() {
	cursorDown.x = event.changedTouches[0].pageX;
	cursorDown.y = event.changedTouches[0].pageY;
	cursorDownHandler();
}, false);

canvas.addEventListener("touchend", function(event) {
	cursorUp.x = event.changedTouches[0].pageX;
	cursorUp.y = event.changedTouches[0].pageY;
	cursorUpHandler();
}, false);

canvas.addEventListener("mouseup", function(event) {
	cursorUp.x = mouse.x;
	cursorUp.y = mouse.y;
	cursorUpHandler();
}, false);

function cursorDownHandler() {
	cursorUp.x = null;
	cursorUp.y = null;
	cursorDown.time = getTime();
}

function cursorUpHandler() {
	cursorUp.time = getTime();

	if(cursorUp.x > cursorDown.x) { // if flick goes to the right
		ball.bounce();
	}
}

function flickAngle() {
	return Math.abs(90-Math.abs(Math.atan((cursorUp.x-cursorDown.x)/(cursorUp.y-cursorDown.y)))*180/Math.PI);
}

function flickSpeed() {
	var flickLength = 10 * findDist({
		x: cursorDown.x,
		y: cursorDown.y
	}, {
		x: cursorUp.x,
		y: cursorUp.y
	});
	flickTime = cursorUp.time - cursorDown.time;
	return flickLength / flickTime; // speed of flick
}
