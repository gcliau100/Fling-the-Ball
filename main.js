document.getElementById("overlay").onclick = function() {
	document.getElementById("overlay").style.display = "none";
};

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var groundHeight = 50;
var ground = canvas.height - groundHeight;
var ballRadius = 40;

var mouse = {
	x: null,
	y: null
};

var controls = {
	x: null,
	y: null
};

var controls2 = {
	x: null,
	y: null
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
}, false);

canvas.addEventListener("touchend", function(event) {
	controls2.x = event.changedTouches[0].pageX;
	controls2.y = event.changedTouches[0].pageY;
	bouncing = true;
}, false);

function flickAngle() {
	return arctan((controls2.x-controls.x)/(controls2.y-controls.y));
}

var bouncing = false;
var initialVel = 30;
var accel = initialVel;

function bounceBall(x) {
	ballPos.y -= accel;
	accel -= 1;
	if(ballPos.y > ground - ballRadius) {
		initialVel *= 0.75;
		accel = initialVel;
		ballPos.y = ground - ballRadius;
		if(initialVel < 1) {
			initialVel = 30;
			bouncing = false;
		}
	}
	mapMove(10);
}

function mapMove(dist) {
	spikes.forEach(function(spike) {
		spike.x -= dist;
	});
	trampolines.forEach(function(trampoline) {
		trampoline.x -= dist;
	});
}

var ballPos = {
	x: canvas.width/2,
	y: ground - ballRadius
};

var trampolineImg = new Image();
trampolineImg.src = "trampoline.png";
var spikesImg = new Image();
spikesImg.src = "spikes.png";
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
	testLine();
	spikes.forEach(function(spike) {
		spike.draw();
	});
	trampolines.forEach(function(trampoline) {
		trampoline.draw();
	});
	drawBall();
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
