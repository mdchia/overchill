const canvas = <HTMLCanvasElement> document.getElementById("gamecanvas"); 
const ctx = canvas.getContext("2d"); 

var lastTime = Date.now();

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

class Vec2d {
	x: number;
	y: number;
	constructor(x: number, y: number) {this.x = x; this.y = y;}
	
	add(v2 : Vec2d) {return new Vec2d(this.x+v2.x, this.y+v2.y);}
	mul(s : number) {return new Vec2d(this.x*s, this.y*s);}
	length() {return Math.sqrt((this.x)^2 + (this.y)^2);}
	normalise() {return new Vec2d(this.x/this.length(), this.y/this.length())};
	dot(v2 : Vec2d) {return new Vec2d(this.x*v2.x, this.y*v2.y);}
}

var rectpos = new Vec2d(40,40);
var rect2pos = new Vec2d(-200,-200);

var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
};

function initialise(){ //~60fps
	const gl = setInterval(gameLoop, 16);
}

function gameLoop(){
	var currentTime = Date.now();
	var delta = currentTime - lastTime;
	lastTime = currentTime;
	rectpos = new Vec2d((currentTime/2)%800, (currentTime/2)%700);
	
	draw();
}

function draw(){
   ctx.fillStyle = "rgba(255,255,255,0.01)";
   ctx.fillRect(0, 0, canvasWidth, canvasHeight);
   ctx.fillStyle = "black";
   ctx.fillRect(rectpos.x, rectpos.y, 20, 20);
   
   ctx.fillStyle = "blue";
   ctx.fillRect(rect2pos.x, rect2pos.y, 10, 10);
}

function canvasSizeChanged(){
	// This will be called to let the game know that the canvas size changed.
	canvasWidth = canvas.width;
	canvasHeight = canvas.height
}



initialise();

canvas.addEventListener('click', function(e) {
    var mouse = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
    }
	rect2pos = new Vec2d(mouse.x-5, mouse.y-5);
});