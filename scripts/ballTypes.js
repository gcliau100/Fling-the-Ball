function BallType(bounciness, trampolineBounciness, speed, image) {
    this.bounciness = bounciness;
    this.trampoline = trampolineBounciness;
    this.speed = speed;
    this.image = image;
    // this.locked = defaultLocked;
    // this.costToUnlock = costToUnlock;

    this.radius = 40; // default

    this.pos = {
        x: 0,
        y: 0
    };

    this.vel = {
        x: 0,
        y: 0
    };

    this.draw = function() {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.pos.x-this.radius, this.pos.y-this.radius, this.radius*2, this.radius*2);
    };

    this.bounce = function() {
    	this.vel.x += 1;
        this.vel.y += 5;
    };

    this.update = function() {
        this.pos.x += this.vel.x;
        mapMove(this.vel.x);
        this.pos.y -= this.vel.y;

        this.vel.x -= 0.1;
        this.vel.y -= 0.1;

        this.validateVel();
    };

    this.validateVel = function() {
        if(this.vel.x < 0) this.vel.x = 0;
        if(this.vel.y < 0 && (this.pos.y + this.radius) > ground) { // if ball is going down
            this.vel.y *= -0.7;
        }
    };
}

var allImages = [];
var imagesLoaded = 0;
allImages[0] = new Image(); allImages[0].src = "img/trampoline.png";
allImages[1] = new Image(); allImages[1].src = "img/spikes.png";
allImages[2] = new Image(); allImages[2].src = "img/basketball.png";
allImages[3] = new Image(); allImages[3].src = "img/tennisball.png";
for(var i = 0; i < allImages.length; i++){
	allImages[i].onload = imgOnload;
}

function imgOnload() {
    imagesLoaded++;
    if(imagesLoaded === allImages.length){
        console.log("All images finished loading.");
    }
}

var trampolineImg = allImages[0];
var spikesImg = allImages[1];
var basketballImg = allImages[2];
var tennisballImg = allImages[3];

var basketball = new BallType(5, 10, 3, allImages[2]);
var tennisball = new BallType(10, 3, 5, allImages[3]);
var rainbow = new BallType(7, 6, 4, "rainbow animation");

rainbow.draw = function() { // rainbow ball has custom animation so this overrides its normal draw() function
    var hue = Math.floor(getTime()/10)%360;
    ctx.fillStyle = ctx.strokeStyle = "hsl(" + hue + ", 85%, 10%)";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, Math.PI*2, false);
    ctx.fill();

    ctx.fillStyle = ctx.strokeStyle = "hsl(" + hue + ", 85%, 40%)";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius-10, Math.PI*2, false);
    ctx.fill();
};

var ball;

function chooseType(type) {
	if(type === "basketball") {
        ball = basketball;
    } else if(type === "tennisball") {
        ball = tennisball;
    } else if(type === "rainbow") {
        ball = rainbow;
    }
    ball.pos.x = canvas.width/2;
    ball.pos.y = ground - ball.radius;
    if(imagesLoaded === allImages.length){
        update();
    }
	document.getElementById("overlay").style.display = "none";
}
