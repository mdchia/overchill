import {Vec2d, TilePosition, HitBox, HitCircle, HitTriangle, HitShape, doesCollide} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {DecorumObject, TileMaterial, Decorum, Tile, Room, drawTile, drawTileFloor, drawTileDecor, drawDecorum} from "./room";


interface updatable {
	update: (room : Room, deltaTime : number) => void;
}

interface drawable {
	draw: (ctx : CanvasRenderingContext2D, translation : Vec2d) => void;
}


export enum EntityState {
	Standing = 0,
	Idle = 1,
	Walking = 2,
	Running = 3
}


export abstract class Entity implements updatable, drawable {
	name: String;
	pos: Vec2d;
	velo: Vec2d;
	dimensions : Vec2d;
	
	hitshape : HitShape;
	direction : Direction;
	
	state : EntityState;
	frame : number;
	
	
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction, dimensions : Vec2d, hs : HitShape, state : EntityState, frame : number){
		this.name = name; this.pos = pos; this.velo = velo; this.direction = direction; this.dimensions = dimensions; this.hitshape = hs; this.state = state; this.frame = frame;
	}
	
	
	getDirection() {return this.direction;}
	setDirection(direction : Direction) {this.direction = direction;}
	
	getHitShape() {return this.getBaseHitShape().translate(this.getPosition());}
	getBaseHitShape() {return this.hitshape;}
	setBaseHitShape(hs : HitShape) {this.hitshape = hs;}
	getPosition() {return this.pos;}
	getVelocity() {return this.velo;}
	setPosition(pos : Vec2d) {this.pos = pos;}
	setVelocity(velo : Vec2d) {this.velo = velo;}
	getDimensions() {return this.dimensions;}
	setDimensions(dim : Vec2d) {this.dimensions = dim;}
	getState() {return this.state;}
	setState(state : EntityState) {this.state = state;}
	getFrame() {return this.frame;}
	setFrame(frame : number) {this.frame = frame;}
	
	
	getTilePosition() {return this.getPosition().toTilePosition();}
	
	update(room : Room, deltaTime : number) {
		if (this.getVelocity().length() != 0) {
			var dest = this.getPosition().add(this.getVelocity().mul(deltaTime));
			var destTilePos = dest.toTilePosition();
			if (room.isWalkableTile(destTilePos)){
				var destTile = room.getTile(destTilePos);
				var decorCollide = false;
				var hs2 = this.getBaseHitShape().translate(dest);
				destTile.getDecor().forEach(function (decorum : Decorum) {
					var hs1 = decorum.getHitShape().translate(destTilePos.toPosition());
					if (doesCollide(hs1, hs2)){
						decorCollide = true;
					}
				});
				if (!decorCollide) {
					this.setPosition(this.getPosition().add(this.getVelocity().mul(deltaTime)));
				} else {
					this.setVelocity(new Vec2d(0,0));
					//this.setPosition(this.getPosition().add(this.getVelocity()));
				}
			} else {
				this.setVelocity(new Vec2d(0,0));
				//this.setPosition(this.getPosition().add(this.getVelocity()));
			}
		}
	}
	
	abstract draw(ctx : CanvasRenderingContext2D, translation : Vec2d) : void;
}

var numberOfFramesInEachAnimationCycle = [1, 0, 1, 0];

var playerFrames : HTMLImageElement[][][];
playerFrames = [];
for (let state in EntityState) {
	if (!isNaN(Number(state))) {
		playerFrames[state] = [];
		for (let dir in Cardinal) {
			if (!isNaN(Number(dir))) {
				playerFrames[state][dir] = [];
				for (var frame = 0; frame < numberOfFramesInEachAnimationCycle[state]; frame++) { //TODO: This is arbitrary, make more general
					playerFrames[state][dir][frame] = new Image();
					playerFrames[state][dir][frame].src = "res/player/state"+state+"/dir"+dir+"/frame" + frame + ".png";
				}
			}
		}
	}
}

var pestImage = new Image();
pestImage.src = "res/blob.png";

export class Player extends Entity {
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction, state : EntityState, frame : number){
		super(name, pos, velo, direction, new Vec2d(32, 33), new HitBox(new Vec2d(0,0), new Vec2d(32,32)), state, frame);
	}
	
	draw (ctx : CanvasRenderingContext2D, translation : Vec2d) {
		var currentImage : HTMLImageElement;
		currentImage = playerFrames[this.getState()][this.getDirection()][Math.floor(this.frame)];
		
		ctx.drawImage(currentImage, this.pos.getX() + translation.getX() - this.getDimensions().getX()/2, this.pos.getY() + translation.getY() - currentImage.height);
	}
}

export class Pest extends Entity {
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction, state : EntityState, frame : number){
		super(name, pos, velo, direction, new Vec2d(32, 33), new HitBox(new Vec2d(0,0), new Vec2d(32,32)), state, frame);
	}
	
	draw (ctx : CanvasRenderingContext2D, translation : Vec2d) {
		ctx.drawImage(pestImage, this.pos.getX() + translation.getX() - this.getDimensions().getX()/2, this.pos.getY() + translation.getY() - pestImage.height);
	}
	
}