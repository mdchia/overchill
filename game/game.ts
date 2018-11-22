import {Vec2d, TilePosition} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {TileMaterial, Decorum, Tile, Room, drawTile} from "./room";
import {Player, Entity} from "./entities";
import {TILESIZE} from "./constants";


//<body onresize="resizeCanvas()" onload="resizeCanvas()">

/* game core */

var keysPressed : any[] = [];
keysPressed[37] = false; keysPressed[38] = false; keysPressed[39] = false; keysPressed[40] = false;


var lastTime = Date.now();

const canvas = <HTMLCanvasElement> document.getElementById("gamecanvas"); 
const ctx = canvas.getContext("2d"); 
ctx.imageSmoothingEnabled = false;

const scene = document.createElement('canvas');
const sceneCtx = scene.getContext("2d");
sceneCtx.imageSmoothingEnabled = false;

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	canvasSizeChanged();
}

document.body.onresize = resizeCanvas;
resizeCanvas();

// Everything  in this section is temporary testing content that will be replaced later
var rectpos = new Vec2d(40,40); // These are the funky background rectangles that I added as a test
var rect2pos = new Vec2d(-200,-200); // but am keeping them right now because they look swell

var tiles : Tile[][] = [];
for (var i = 0; i < 21; i++){ // Rows
	tiles[i] = [];
	for (var j = 0; j < 21; j++){ // Columns
		if (i + j < 35) {
			if (Math.abs(10-i)*Math.abs(10 - j) > 5) {
				if (Math.abs(i-j) > 3) {
					tiles[i][j] = new Tile(new TilePosition(i,j), TileMaterial.Tiled, "", []);
				} else {
					tiles[i][j] = new Tile(new TilePosition(i,j), TileMaterial.Solid, "rgba(130,0,0,1)", []);
				}
			} else {
				tiles[i][j] = new Tile(new TilePosition(i,j), TileMaterial.Chess, "", []);
			}
		}
	}
}
var room = new Room("Main", tiles, new TilePosition(0,0));
scene.width = room.getDimension().getX();
scene.height = room.getDimension().getY();

var player = new Player("John Smith", room.getInitialTile().getCentre(), new Vec2d(0,0), Cardinal.S);
//---------



var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
};

function initialise(){ //~60fps
	const gl = setInterval(gameLoop, 16);
}

function gameLoop(){ // Does the bare minimal right now. No collision detection or anything, yet.
	var currentTime = Date.now();
	var delta = currentTime - lastTime;
	lastTime = currentTime;
	rectpos = new Vec2d((currentTime/2)%800, (currentTime/2)%700);
	
	var accel = player.getVelocity().mul(-0.4);
	var acceltemp = new Vec2d(0,0);
	if (keysPressed[37]) acceltemp = acceltemp.add(new Vec2d(-1,0));
	if (keysPressed[38]) acceltemp = acceltemp.add(new Vec2d(0,-1));
	if (keysPressed[39]) acceltemp = acceltemp.add(new Vec2d(1,0));
	if (keysPressed[40]) acceltemp = acceltemp.add(new Vec2d(0,1));
	acceltemp = acceltemp.max(1);
	player.setVelocity(player.getVelocity().add(accel.add(acceltemp)));
	player.setVelocity(player.getVelocity().max(4));
	player.update();
	draw();
}

var translateX = 40; // Need to flesh this out with a full system for translations & rotations -- Might just be able to just draw onto another context and then draw that context transformed within this one
var translateY = 40;
function draw(){
	
   // This just draws the pretty ether backdrop. Was a test but decided to keep it because it just looks swell.
   ctx.fillStyle = "rgba(255,255,255,0.01)";
   ctx.fillRect(0, 0, canvasWidth, canvasHeight);
   ctx.fillStyle = "black";
   ctx.fillRect(rectpos.getX(), rectpos.getY(), 20, 20);
   
   ctx.fillStyle = "blue";
   ctx.fillRect(rect2pos.getX(), rect2pos.getY(), 10, 10);
   //-------------------------------------
   
   //
   var tilerows = room.getTiles();
   tilerows.forEach(function (tilecols) {
	   tilecols.forEach(function (tile) {
		   drawTile(ctx, new Vec2d(translateX, translateY), room, tile.getTilePosition());
	   });
   });
  
   // We can draw things to sceneCtx instead and draw them to the screen using the following:
   // This operates as a sort of "window" or "layer" within our canvas.
   //ctx.putImageData(sceneCtx.getImageData(0,0,scene.width,scene.height),translateX,translateY);
   //ctx.drawImage(scene,translateX,translateY);
   
   ctx.fillStyle = "red";
   ctx.fillRect(player.getPosition().getX() -7.5 + translateX, player.getPosition().getY() - 7.5 + translateY, 15, 15);
   
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

window.addEventListener('keydown', function(e : KeyboardEvent) {
	keysPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function(e : KeyboardEvent) {
	keysPressed[e.keyCode] = false;
});
