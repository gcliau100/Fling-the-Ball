document.getElementById("overlay").onclick = function() {
	document.getElementById("overlay").style.display = "none";
};

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var beginningTime = (new Date()).getTime();
function getTime() { // Returns the number of milliseconds since the beginning.
    return Math.round((new Date()).getTime() - beginningTime);
}

var score = 0;

var highscore = localStorage.highscore;
if(!highscore) {
	highscore = 0;
}
document.getElementById("highScore").innerHTML = highscore;

var groundHeight = 51;
var ground = canvas.height - groundHeight;
var ballRadius = 40;

var mouse = {
	x: null,
	y: null
};

var controls = {
	x: null,
	y: null,
	time: null
};

var controls2 = {
	x: null,
	y: null,
	time: null
};

canvas.addEventListener("mousemove", function(event) {
	mouse.x = event.layerX;
	mouse.y = event.layerY;
}, false);

canvas.addEventListener("touchstart", function(event) {
	controls2.x = null;
	controls2.y = null;
	controls.x = event.changedTouches[0].pageX;
	controls.y = event.changedTouches[0].pageY;
	controls.time = getTime();
}, false);

canvas.addEventListener("touchend", function(event) {
	controls2.x = event.changedTouches[0].pageX;
	controls2.y = event.changedTouches[0].pageY;
	controls2.time = getTime();

	initialModifier = flickSpeed();

	if(controls2.x > controls.x) {
		if(!bouncing) {
			bouncing = true;
			initialVel = flickAngle()/2;
		}
	}
}, false);

function flickAngle() {
	return Math.abs(90-Math.abs(Math.atan((controls2.x-controls.x)/(controls2.y-controls.y)))*180/Math.PI);
}

function flickSpeed() {
	var d = findDist({
		x: controls.x,
		y: controls.y
	}, {
		x: controls2.x,
		y: controls2.y
	})*10;
	return d/(controls2.time - controls.time);
}

var bouncing = false;
var initialVel = 0;
var accel = initialVel;
var initialModifier = 1;

function bounceBall() {
	ballPos.y -= accel;
	accel -= 1;
	if(ballPos.y > ground - ballRadius) {
		initialVel *= 0.75;
		accel = initialVel;
		ballPos.y = ground - ballRadius;
		if(initialVel < 1) { // when finished bouncing
			initialVel = 0;
			bouncing = false;
			gameOver();
		}
	}
	mapMove(initialModifier);
}

function mapMove(dist) {
	dist = Math.abs(dist);
	spikes.forEach(function(spike) {
		spike.x -= dist;
	});
	trampolines.forEach(function(trampoline) {
		trampoline.x -= dist;
	});
	score += dist;
}

var ballPos = {
	x: canvas.width/2,
	y: ground - ballRadius
};

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

var trampolineImg = new Image();
trampolineImg.src = "https://cloud.githubusercontent.com/assets/15713577/11020742/34a4eabe-85de-11e5-990b-ccaf6e0f1166.png";
var spikesImg = new Image();
spikesImg.src = "https://cloud.githubusercontent.com/assets/15713577/11020737/15726a54-85de-11e5-9d88-7cde0b819af1.png";
trampolineImg.onload = function() {
	spikesImg.onload = function() {
		update();
	};
};

function update() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	backgroundHeight();
	if(bouncing) {
		bounceBall();
	}
	// testLine();
	spikes.forEach(function(spike) {
		spike.draw();
		if(
			findCollision({
				center: {
					x: spike.x+62.5,
					y: ground-102+62.5
				},
				sideLength: 125
			}, {
				center: ballPos,
				radius: ballRadius
			}) && findCollision({
				center: {
					x: spike.x+137.5,
					y: ground-102+62.5
				},
				sideLength: 125
			}, {
				center: ballPos,
				radius: ballRadius
			})
		) {
			gameOver();
		}
	});
	trampolines.forEach(function(trampoline) {
		trampoline.draw();
		if(ballPos.y+ballRadius > ground-50 && ballPos.x > trampoline.x && ballPos.x < trampoline.x + 205) {
			initialVel *= 1.6;
		}
	});
	drawBall();
	document.getElementById("score").innerHTML = Math.floor(score / 75 * 100) / 100;
	window.requestAnimationFrame(update);
}

function backgroundHeight() {
	ctx.fillStyle = "limegreen";
	ctx.beginPath();
	ctx.rect(0, ground, canvas.width, groundHeight);
	ctx.fill();
}

function Spike(x) { // class
	this.x = x;
	this.draw = function() {
		ctx.drawImage(spikesImg,0, 0, 800,500, this.x, ground-102, 200, 125);
	};
}

var spikes = [];

for(var i = 0; i < 30; i++) { // make 30 spikes
	spikes.push(new Spike(800*(Math.random()+1)*i+1000));
}

function Trampoline(x) {
	this.x = x;
	this.draw = function() {
		ctx.drawImage(trampolineImg,0, 0, 205, 75, this.x, ground-70, 205, 75);
	};
}

var trampolines = [];

for(var j = 0; j < 30; j++) { // make 30 trampolines
	trampolines.push(new Trampoline(900*(Math.random()+1)*j+800));
}

function drawBall() {
	ctx.fillStyle = "#230EBE";
	ctx.beginPath();
	ctx.arc(ballPos.x, ballPos.y, ballRadius, Math.PI*2, false);
	ctx.fill();
}

function testLine() {
	if(controls.x && controls.y && controls2.y && controls2.y) {
		ctx.beginPath();
		ctx.moveTo(controls.x, controls.y);
		ctx.lineTo(controls2.x, controls2.y);
		ctx.strokeStyle = "#255";
		ctx.stroke();
	}
}

function gameOver() {
	bouncing = false;
	if(Math.floor(score / 75 * 100) / 100 > highscore) {
		highscore = Math.floor(score / 75 * 100) / 100;
		localStorage.highscore = highscore;
	}
	document.getElementById("gameOverScore").innerHTML = Math.floor(score / 75 * 100) / 100;
	document.getElementById("gameOverHighScore").innerHTML = highscore;
	document.getElementById("gameOver").style.display = "block";
	document.getElementById("gameOver").onclick = function() {
		location.reload();
	};
}
