var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; // make the canvas fill the entire space
canvas.height = window.innerHeight;

var beginningTime = (new Date()).getTime();
function getTime() { // Returns the number of milliseconds since the beginning.
    return Math.round((new Date()).getTime() - beginningTime);
}

var score = 0;

var highscore = (+localStorage.highscore) || 0;
document.getElementById("highScore").innerHTML = highscore;

function getCoins() {
	var coins = localStorage.coins || 0;
	return + coins; // return an integer
}

function addCoins(coinsToAdd) {
	coinsToAdd = Math.floor(coinsToAdd);
	localStorage.coins = getCoins() + coinsToAdd;
}

var basketballUnlocked = (localStorage.basketball && localStorage.basketball !== "false") || false;
var tennisballUnlocked = (localStorage.tennisball && localStorage.tennisball !== "false") || false;

if(basketballUnlocked) {
	document.getElementById("basketball").className = "";
	document.getElementById("basketball").onclick = function() {
		chooseType("basketball");
	};
}

if(tennisballUnlocked) {
	document.getElementById("tennisball").className = "";
	document.getElementById("tennisball").onclick = function() {
		chooseType("tennisball");
	};
}

document.getElementById("rainbow").onclick = function() {
	chooseType("rainbow");
};

document.getElementById("coins").innerHTML = getCoins();

var groundHeight = 110; // pixels from the bottom of the canvas
var ground = canvas.height - groundHeight;
var ballRadius = 40;
var ballType = "rainbow"; // three types: rainbow, tennisball, or basketball
function chooseType(type) {
	ballType = type;
	document.getElementById("overlay").style.display = "none";
}

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

	initialModifier = flickSpeed();

	if(cursorUp.x > cursorDown.x) {
		if(!bouncing) {
			bouncing = true;
			initialVel = flickAngle()/2;
		}
	}
}

function flickAngle() {
	return Math.abs(90-Math.abs(Math.atan((cursorUp.x-cursorDown.x)/(cursorUp.y-cursorDown.y)))*180/Math.PI);
}

function flickSpeed() {
	var d = findDist({
		x: cursorDown.x,
		y: cursorDown.y
	}, {
		x: cursorUp.x,
		y: cursorUp.y
	})*10;
	return d/(cursorUp.time - cursorDown.time);
}
