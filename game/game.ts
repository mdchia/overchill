import {Vec2d, TilePosition} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {DecorumObject, TileMaterial, Decorum, Tile, Room, drawTile, drawTileFloor, drawTileDecor, drawDecorum} from "./room";
import {Player, EntityState, Entity, Pest} from "./entities";
import {TILESIZE, FPS} from "./constants";


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
					tiles[i][j] = new Tile(new TilePosition(j,i), TileMaterial.Tiled, "", []);
				} else {
					tiles[i][j] = new Tile(new TilePosition(j,i), TileMaterial.Solid, "rgba(130,0,0,1)", []);
				}
			} else {
				tiles[i][j] = new Tile(new TilePosition(j,i), TileMaterial.Chess, "", []);
			}
		}
	}
}

	
var room = new Room("Main", tiles, new TilePosition(5,5));
room.getTiles()[4][4].setDecor([new Decorum(DecorumObject.Test, "", Cardinal.S)]);
room.getTiles()[8][6].setDecor([new Decorum(DecorumObject.Test, "", Cardinal.S)]);
room.getTiles()[12][12].setDecor([new Decorum(DecorumObject.Test, "", Cardinal.S)]);
room.getTiles()[6][7].setMaterial(TileMaterial.Blank);	
room.getTiles()[0].forEach(function (tile : Tile) {tile.setMaterial(TileMaterial.Blank);tile.setDecor([new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)])} );
room.getTiles()[15][3].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[15][4].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[15][5].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[15][6].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[15][7].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[16][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[17][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[18][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[19][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[16][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[17][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[18][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[19][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][3].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][4].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][5].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][6].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[20][7].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[15][2].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);
room.getTiles()[15][8].setDecor([new Decorum(DecorumObject.Blockade, "", Cardinal.S)]);



room.getTiles()[15][12].setDecor([new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)]);
room.getTiles()[15][13].setDecor([new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)]);
room.getTiles()[15][14].setDecor([new Decorum(DecorumObject.GlassTop, "", Cardinal.S)]);
room.getTiles()[15][15].setDecor([new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)]);
room.getTiles()[15][16].setDecor([new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)]);
//room.getTiles().forEach(function (tilerow : Tile[]) {tilerow[0].setMaterial(TileMaterial.Blank); tilerow[0].setDecor([new Decorum(DecorumObject.Wall1Left, "", Cardinal.E)])});
//room.getTiles()[0][0].setDecor([new Decorum(DecorumObject.Test, "", Cardinal.S),new Decorum(DecorumObject.Wall1Top, "", Cardinal.S)]);
	
scene.width = room.getDimension().getX();
scene.height = room.getDimension().getY();

var player = new Player("John Smith", room.getInitialTile().getCentre(), new Vec2d(0,0), Cardinal.S, EntityState.Standing, 0);
//---------
var testPests : Pest[];
testPests = [];
testPests[0] = new Pest("goober1", new Vec2d(140,600), new Vec2d(0,0), Cardinal.E, EntityState.Standing, 0);
testPests[3] = new Pest("goober2", new Vec2d(180,600), new Vec2d(0,0), Cardinal.E, EntityState.Standing, 0);
testPests[4] = new Pest("goober3", new Vec2d(140,640), new Vec2d(0,0), Cardinal.E, EntityState.Standing, 0);

//var entities : Entity[];
//entities = [];
//entities[0] = player;
//entities[1] = testPest;

var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
};

function initialise(){ //~60fps
	const gl = setInterval(gameLoop, 1/FPS*1000);
}

var translation = new Vec2d(40,40); // Need to flesh this out with a full system for translations & rotations -- Might just be able to just draw onto another context and then draw that context transformed within this one
var transVel = new Vec2d(0,0);

function gameLoop(){ // Does the bare minimal right now. No collision detection or anything, yet.
	var currentTime = Date.now();
	var deltaTime = 1/FPS;//(currentTime - lastTime)/1000;
	lastTime = currentTime;
	rectpos = new Vec2d((currentTime/2)%900, (currentTime/2)%800);
	
	var accel = player.getVelocity().mul(-15);
	var acceltemp = new Vec2d(0,0);
	if (keysPressed[37]) acceltemp = acceltemp.add(new Vec2d(-100000,0)); //walking controls, test
	if (keysPressed[38]) acceltemp = acceltemp.add(new Vec2d(0,-100000));
	if (keysPressed[39]) acceltemp = acceltemp.add(new Vec2d(100000,0));
	if (keysPressed[40]) acceltemp = acceltemp.add(new Vec2d(0,100000));
	acceltemp = acceltemp.max(100000).mul(deltaTime);
	if (acceltemp.length() != 0) player.setDirection(acceltemp.getCardinalDirection()); 
	accel = (accel.add(acceltemp)).mul(deltaTime);
	player.setVelocity(player.getVelocity().add(accel));
	//player.setVelocity(player.getVelocity()).max(100));
	player.update(room, deltaTime);
	
	testPests.forEach(function (testPest) {
		var pestAccel = testPest.getVelocity().mul(-3).mul(deltaTime);
		if (Math.floor(Math.random() * 150) == 1){
			var angle = Math.floor(Math.random()*360);
			testPest.setVelocity(new Vec2d(Math.cos(angle), Math.sin(angle)).mul(100));
		}
		testPest.setVelocity(testPest.getVelocity().add(pestAccel));
		testPest.update(room, deltaTime);
	});
	draw();
	
	var targetTrans = new Vec2d(canvas.width/2, canvas.height/2).add(room.getDimension().mul(-0.5));
	transVel = targetTrans.sub(translation).mul(0.1);
	translation = translation.add(transVel);
}


function draw(){
	
   // This just draws the pretty ether backdrop. Was a test but decided to keep it because it just looks swell.
   ctx.fillStyle = "rgba(255,255,255,0.01)";
   ctx.fillRect(0, 0, canvasWidth, canvasHeight);
   ctx.fillStyle = "black";
   ctx.fillRect(rectpos.getX(), rectpos.getY(), 20, 20);
   ctx.fillStyle = "blue";
   ctx.fillRect(rect2pos.getX(), rect2pos.getY(), 10, 10);
	
   //-------------------------------------
   
   var tilerows = room.getTiles();
   tilerows.forEach(function (tilecols) {
	   tilecols.forEach(function (tile) {
			drawTileFloor(ctx, translation, room, tile.getTilePosition());
	   });
   });
	
	var playerPos = player.getTilePosition();
	var playerY = player.getTilePosition().getY();
	
	if (playerY >= 0 && playerY < tilerows.length) {

		for (var i = 0; i < playerY; i++){
			tilerows[i].forEach(function (tile) {
				drawTileDecor(ctx, translation, room, tile.getTilePosition());
		   });
		}
		
		var tilecols = tilerows[playerY];
		tilecols.forEach(function (tile) {
			tile.getDecor().forEach(function (decorum : Decorum) {
				if (decorum.getOriginPoint().add(tile.getPosition()).getY() < player.getPosition().getY()) {
					drawDecorum(ctx, translation, room, tile.getTilePosition(), decorum); 
				}
			});
		});
		
		player.draw(ctx, translation);
		
		tilecols.forEach(function (tile) { //todo: can probably optimise this
			tile.getDecor().forEach(function (decorum : Decorum) {
				if (decorum.getOriginPoint().add(tile.getPosition()).getY() >= player.getPosition().getY()) {
					drawDecorum(ctx, translation, room, tile.getTilePosition(), decorum); 
				}
			});
		});
		//tile.getDecor().forEach(function(decorum : Decorum) {
		//	if (decorum.getPosition().add(tile)
		//});
		//player.draw(ctx, translation);

		for (var i = playerY + 1; i < tilerows.length; i++){
			tilerows[i].forEach(function (tile) {
				drawTileDecor(ctx, translation, room, tile.getTilePosition());
		    });
		}
	} else {
		player.draw(ctx, translation);

		tilerows.forEach(function (tilecols){
			tilecols.forEach(function (tile) {
				drawTileDecor(ctx, translation, room, tile.getTilePosition());
			});
		});
	}
	
	testPests.forEach(function (testPest) {
	testPest.draw(ctx, translation);
	});
   // We can draw things to sceneCtx instead and draw them to the screen using the following:
   // This operates as a sort of "window" or "layer" within our canvas.
   //ctx.putImageData(sceneCtx.getImageData(0,0,scene.width,scene.height),translateX,translateY);
   //ctx.drawImage(scene,translateX,translateY);
   

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
