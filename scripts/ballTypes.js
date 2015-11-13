function BallType(bounciness, trampolineBounciness, speed, image) {
    this.bounciness = bounciness;
    this.trampoline = trampolineBounciness;
    this.speed = speed;
    this.image = image;
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
        update();
    }
}

var trampolineImg = allImages[0];
var spikesImg = allImages[1];
var basketballImg = allImages[2];
var tennisballImg = allImages[3];

var basketball = new BallType(5, 10, 3, allImages[2]);
var tennisball = new BallType(10, 3, 5, allImages[3]);
var rainbow = new BallType(7, 6, 4, "rainbow animation");
