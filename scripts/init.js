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

function Spike(initialX) { // class
	this.x = initialX;
	this.draw = function() {
		ctx.drawImage(spikesImg, 0, 0, 800, 500, this.x, ground-102, 200, 125);
	};
}

function Trampoline(initialX) {
	this.x = initialX;
	this.draw = function() {
		ctx.drawImage(trampolineImg, 0, 0, 205, 75, this.x, ground-70, 205, 75);
	};
}

var spikes = [];
var trampolines = [];

var counter = 400;
for(var i = 0; i < 70; i++) {
	counter += Math.random()*800+500;
	if(Math.random() < 0.6) { // 60% chance to make a spike
		spikes.push(new Spike(counter));
	} else { // 40% chance to make a trampoline
		trampolines.push(new Trampoline(counter));
	}
}

function findDist(pointone, pointtwo) {
    return Math.sqrt(Math.pow(pointtwo.x-pointone.x, 2) + Math.pow(pointtwo.y-pointone.y, 2));
}

function findCollision(square, circle) { // returns true if circle touches the square
    var halfSide = square.sideLength/2;

	var cornerCol =
    (findDist({x: square.center.x-halfSide, y: square.center.y-halfSide}, {x: circle.center.x, y: circle.center.y}) < circle.radius) ||
    (findDist({x: square.center.x+halfSide, y: square.center.y-halfSide}, {x: circle.center.x, y: circle.center.y}) < circle.radius) ||
    (findDist({x: square.center.x+halfSide, y: square.center.y+halfSide}, {x: circle.center.x, y: circle.center.y}) < circle.radius) ||
    (findDist({x: square.center.x-halfSide, y: square.center.y+halfSide}, {x: circle.center.x, y: circle.center.y}) < circle.radius);

    var sideCol =
    (square.center.x-halfSide < circle.center.x && circle.center.x < square.center.x+halfSide && square.center.y-halfSide-circle.radius < circle.center.y && circle.center.y < square.center.y+halfSide+circle.radius) ||
    (square.center.x-halfSide-circle.radius < circle.center.x && circle.center.x < square.center.x+halfSide+circle.radius && square.center.y-halfSide < circle.center.y && circle.center.y < square.center.y+halfSide);

    return (cornerCol || sideCol);
}

function mapMove(dist) {
	spikes.forEach(function(spike) {
		spike.x -= dist;
	});
	trampolines.forEach(function(trampoline) {
		trampoline.x -= dist;
	});
	score += dist;
}
