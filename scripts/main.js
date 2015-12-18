function update() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawGround();
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
				center: ball.pos,
				radius: ball.radius
			}) || findCollision({
				center: {
					x: spike.x+137.5,
					y: ground-102+62.5
				},
				sideLength: 125
			}, {
				center: ball.pos,
				radius: ball.radius
			})
		) {
			gameOver();
		}
	});
	trampolines.forEach(function(trampoline) {
		trampoline.draw();
		if(ball.pos.y+ball.radius > ground-50 && ball.pos.x > trampoline.x && ball.pos.x < trampoline.x + 205) {
			ball.vel.y *= 1.5;
		}
	});

	ball.update();
	ball.draw();

	document.getElementById("score").innerHTML = Math.floor(score / 75 * 100) / 100;
	var alt = (ball.pos.y - (ground - ball.radius));
	document.getElementById("altitude").innerHTML = (Math.floor(alt*10)/-10);
	window.requestAnimationFrame(update);
}

function drawGround() {
	ctx.fillStyle = "#19860c";
	ctx.beginPath();
	ctx.rect(0, ground, canvas.width, groundHeight);
	ctx.fill();
}

function gameOver() {
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
