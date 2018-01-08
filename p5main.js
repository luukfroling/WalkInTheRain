var video;
var prevImg; var curImg;
var buffer = 75;
var avrX = 1;
var avrY = 1;
var count = 1;
var b;
let r = [];
let drops = 150;

function setup(){
  b = new ball();
  for(let i = 0; i < drops; i++){
    r.push(new rain());
  }
  prevImg = createImage(360,240);
  curImg = createImage(360,240);
  video = createCapture(VIDEO);
  createCanvas(320,240);
  background(51);
  video.size(360,240);
  video.hide();
}

function draw(){
  image(video, 0, 0);
  trackMotion(curImg, prevImg, b);
  for(let i = 0; i < r.length; i++){
    r[i].update();
  }
}

class ball {
  constructor(){
    this.x = 50;
  }

  move(avrx, avry){
    if(avrx != 0){
      this.x = avrx;
    }
    this.y = 50;
    this.draw();
  }

  draw(){
    ellipse(this.x, this.y, 40, 40);
  }
}

function trackMotion(curImg, prevImg, b){
  prevImg = video.get();
  prevImg.loadPixels();
  curImg = video.get();
  curImg.loadPixels();
  avrX = 0; avrY = 0; count = 0;
  for(let i  = 0; i < prevImg.width; i++){
    for(let j = 0; j < prevImg.height; j++){
      var curPixel = getPixelPlace(i, j, prevImg.width);
      if(distsq(prevImg.pixels[curPixel],prevImg.pixels[curPixel+1],prevImg.pixels[curPixel+2],curImg.pixels[curPixel],curImg.pixels[curPixel+1],curImg.pixels[curPixel+2]) > buffer * buffer){
        prevImg.pixels[curPixel] = 0;
        prevImg.pixels[curPixel + 1] = 0;
        prevImg.pixels[curPixel + 2] = 0;
        prevImg.pixels[curPixel + 3] = 255;
        avrX += i; avrY += j; count++;
      } else {
        prevImg.pixels[curPixel] = 255;
        prevImg.pixels[curPixel + 1] = 255;
        prevImg.pixels[curPixel + 2] = 255;
        prevImg.pixels[curPixel + 3] = 255;
      }
    }
  }
  fill(255, 255 , 0);
  if(count != 0){
    avrX /= count;
  }
  if(avrY/count == avrY/count){
    avrY /= count;
  }
  b.move(avrX, avrY);
  avrX = 1; avrY = 1; count = 1;
  prevImg.updatePixels();
  //image(prevImg,0,240,video.width,video.height*2);
}
function getPixelPlace(x, y, width){
  return (x + y * width) * 4;
}

function distsq(r1, g1, b1, r2, g2, b2){
  return (r2-r1)*(r2-r1) + (g2-g1)*(g2-g1) + (b2-b1)*(b2-b1);
}

class rain {
  constructor(){
    //Positions
    this.x = Math.random() * 360;
    this.y = 0;
    //Previous positions
    this.px;
    this.py;
    //Speed
    this.speed = random() * 5 + 10;
  }

  update(){
    this.fall(0.01);
    this.show();
  }
  fall(wind){
    //Change height
    this.py = this.y;
    this.y += this.speed;
    //change horizontal Position.
    this.px = this.x;
    this.x += this.speed * wind;
    //Check if out of screen
    if(this.y > 240) {
      this.y = 0;
      this.py = 0;
      this.x = Math.random() * 360;
      this.px = 0;
      this.speed = random()*10 + 10;
    }
  }

  show(){
    stroke(255);
    if(Math.abs(this.x - b.x) > 30){
      line(this.px, this.py, this.x, this.y);
    }
  }
}
