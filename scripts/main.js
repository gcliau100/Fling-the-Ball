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
	if(ballType === "basketball") dist *= 0.75;
	if(ballType === "tennisball") dist *= 1.4;
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


function update() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	backgroundHeight();
	if(bouncing) {
		bounceBall();
	}
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
			}) || findCollision({
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
			if(ballType === "basketball") {
				initialVel *= 1.8;
			} else if(ballType === "tennisball") {
				initialVel *= 1.1;
			} else {
				initialVel *= 1.5;
			}
		}
	});
	drawBall();
	document.getElementById("score").innerHTML = Math.floor(score / 75 * 100) / 100;
	window.requestAnimationFrame(update);
}

function backgroundHeight() {
	ctx.fillStyle = "#19860c";
	ctx.beginPath();
	ctx.rect(0, ground, canvas.width, groundHeight);
	ctx.fill();
}

function Spike(x) { // class
	this.x = x;
	this.draw = function() {
		ctx.drawImage(spikesImg, 0, 0, 800, 500, this.x, ground-102, 200, 125);
	};
}

function Trampoline(x) {
	this.x = x;
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

function drawBall() {
	var ballImage = 0;

	if(ballType === "basketball") {
		ctx.drawImage(basketballImg, 0, 0, basketballImg.width, basketballImg.height, ballPos.x-ballRadius, ballPos.y-ballRadius, ballRadius*2, ballRadius*2);
	} else if(ballType === "tennisball") {
		ctx.drawImage(tennisballImg, 0, 0, tennisballImg.width, tennisballImg.height, ballPos.x-ballRadius, ballPos.y-ballRadius, ballRadius*2, ballRadius*2);
	} else { // rainbow
		var hue = Math.floor(getTime()/10)%360;
		ctx.fillStyle = ctx.strokeStyle = "hsl("+hue+", 85%, 10%)";
		ctx.beginPath();
		ctx.arc(ballPos.x, ballPos.y, ballRadius, Math.PI*2, false);
		ctx.fill();

		ctx.fillStyle = ctx.strokeStyle = "hsl("+hue+", 85%, 40%)";
		ctx.beginPath();
		ctx.arc(ballPos.x, ballPos.y, ballRadius-10, Math.PI*2, false);
		ctx.fill();
	}
}

function gameOver() {
	bouncing = false;
	var score_ = Math.floor(score / 75 * 100) / 100;
	if(score_ > highscore) {
		highscore = score_;
		localStorage.highscore = highscore;
	}

	addCoins(score_);

	document.getElementById("gameOverScore").innerHTML = score_;
	document.getElementById("gameOverHighScore").innerHTML = highscore;
	document.getElementById("gameOver").style.display = "block";
	document.getElementById("gameOver").onclick = function() {
		location.reload();
	};
}
