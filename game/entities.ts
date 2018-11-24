import {Vec2d, TilePosition, HitBox, HitCircle, HitTriangle, HitShape, doesCollide} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {DecorumObject, TileMaterial, Decorum, Tile, Room, drawTile, drawTileFloor, drawTileDecor, drawDecorum} from "./room";


interface updatable {
	update: (room : Room, deltaTime : number) => void;
}

interface drawable {
	draw: (ctx : CanvasRenderingContext2D, translation : Vec2d) => void;
}


export abstract class Entity implements updatable, drawable {
	name: String;
	pos: Vec2d;
	velo: Vec2d;
	dimensions : Vec2d;
	
	hitshape : HitShape;
	
	
	direction : Direction;
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction, dimensions : Vec2d, hs : HitShape){
		this.name = name; this.pos = pos; this.velo = velo; this.direction = direction; this.dimensions = dimensions; this.hitshape = hs;
	}
	
	
	getHitShape() {return this.getBaseHitShape().translate(this.getPosition());}
	getBaseHitShape() {return this.hitshape;}
	setBaseHitShape(hs : HitShape) {this.hitshape = hs;}
	getPosition() {return this.pos;}
	getVelocity() {return this.velo;}
	setPosition(pos : Vec2d) {this.pos = pos;}
	setVelocity(velo : Vec2d) {this.velo = velo;}
	getDimensions() {return this.dimensions;}
	setDimensions(dim : Vec2d) {this.dimensions = dim;}
	
	getDirection() {return this.direction;}
	setDirection(direction : Direction) {this.direction = direction;}
	
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

var playerFrames : HTMLImageElement[];
playerFrames = [];
for (var i = 0; i<4; i++) {
	playerFrames[i] = new Image();
	playerFrames[i].src = "res/player/frame" + i + ".png";
}

export class Player extends Entity{
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction){
		super(name, pos, velo, direction, new Vec2d(32, 33), new HitBox(new Vec2d(0,0), new Vec2d(32,32)));
	}
	
	draw (ctx : CanvasRenderingContext2D, translation : Vec2d) {
		var currentImage : HTMLImageElement;
		
		switch (this.direction) {
			case Cardinal.S : {
				currentImage = playerFrames[0];
				break;
			}
			case Cardinal.W : {
				currentImage = playerFrames[1];
				break;
			}
			case Cardinal.E : {
				currentImage = playerFrames[2];
				break;
			}
			case Cardinal.N : {
				currentImage = playerFrames[3];
				break;
			}
			default: {
				currentImage = currentImage = playerFrames[0];
			}
		}
		
		ctx.drawImage(currentImage, this.pos.getX() + translation.getX() - this.getDimensions().getX()/2, this.pos.getY() + translation.getY() - currentImage.height);
	}
}