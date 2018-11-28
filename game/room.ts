import {Vec2d, TilePosition, HitBox, HitCircle, HitTriangle, HitShape, doesCollide} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {TILESIZE} from "./constants";


var tiledImage = new Image();
tiledImage.src = "res/tiled.png";

var testImage = new Image();
testImage.src = "res/test.png";

var wall1TopImage = new Image();
wall1TopImage.src = "res/wall1top.png";

var glassTopImage = new Image();
glassTopImage.src = "res/glasstop.png";

var blockadeImage = new Image();
blockadeImage.src = "res/blockade.png";

//var wall1LeftImage = new Image();
//wall1LeftImage.src = "res/wall1left.png";

export enum DecorumObject {
	Test = "test",
	Wall1Top = "wall1top",
	//Wall1Left = "wall1left",
	GlassTop = "glasstop",
	Blockade = "blockade"
}

export enum TileMaterial {
	Blank = "blank",
	Solid = "solid",
	Chess = "chess",
	Tiled = "tiled"
}

export class Decorum {	
	decorumObject : DecorumObject;
	meta : String;
	direction : Cardinal;
	
	getHitShape() {
		switch (this.decorumObject) {
			case DecorumObject.Test: {
				return new HitBox(new Vec2d(0,20), new Vec2d(32,32));
				break;
			}
			case DecorumObject.Wall1Top: {
				return new HitBox(new Vec2d(0,22), new Vec2d(32,32));
				break;
			}
			//case DecorumObject.Wall1Left: {
			//	return new HitBox(new Vec2d(22,0), new Vec2d(32,32));
			//	break;
			//}
			case DecorumObject.GlassTop: {
				return new HitBox(new Vec2d(0,22), new Vec2d(32,32));
				break;
			}
			
			case DecorumObject.Blockade: {
				return new HitBox(new Vec2d(0,0), new Vec2d(32,32));
				break;
			}
			//default: {
			//	return new HitBox(new Vec2d(0,0), new Vec2d(32,32));
			//}
		}
	}
	
	getOriginPoint() {
		switch (this.decorumObject) {
			case DecorumObject.Test: {
				return new Vec2d(16,28);
				break;
			}
			case DecorumObject.Wall1Top: {
				return new Vec2d(16,32);
				break;
			}
			case DecorumObject.GlassTop: {
				return new Vec2d(16,32);
				break;
			}
			case DecorumObject.Blockade: {
				return new Vec2d(16,-1);
				break;
			}
		}
	}
	
	getDecorumObject() {return this.decorumObject;}
	setDecorumObject(decObj : DecorumObject) {this.decorumObject = decObj;}
	constructor(decorumObject : DecorumObject, meta : String, direction : Cardinal) {this.decorumObject = decorumObject; this.meta = meta, this.direction = direction}
}

export class Tile {
	tilePosition : TilePosition;
	material : TileMaterial;
	meta : String;
	decor : Decorum[];
	
	getMaterial() {return this.material;}
	setMaterial(material : TileMaterial) {this.material = material;}
	getMeta() {return this.meta;}
	
	getDecor() {return this.decor;}
	setDecor(decor : Decorum[]) {this.decor = decor;}
	
	getTilePosition() {return this.tilePosition;}
	getPosition() {return this.tilePosition.mul(TILESIZE);}
	getCentre() {return this.tilePosition.mul(TILESIZE).add(new Vec2d(TILESIZE/2, TILESIZE/2));}
	constructor(tilePosition : TilePosition, material : TileMaterial, meta : String, decor : Decorum[]){this.tilePosition = tilePosition; this.material = material; this.meta = meta; this.decor = decor;}
}
export class Room {
	name : String;
	tiles : Tile[][]; // First dimension is row, second is column. We draw rooms row-by-row, adding relevant entities inbetween.
	private initialTile : TilePosition;
	
	getTiles() {return this.tiles};
	getTile(p : TilePosition){return this.tiles[p.getY()][p.getX()]}
	getInitialTile() {return this.tiles[this.initialTile.getY()][this.initialTile.getX()]};
	getTileDimension() {
		var largeX = 0;
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].length > largeX) largeX = this.tiles[i].length;
		}
		return new TilePosition(largeX, this.tiles.length);
	}
	getDimension() {
		return this.getTileDimension().mul(TILESIZE);
	}
	
	isValidTile(tilePos : TilePosition) : boolean {
		var valid = false;
		if ((0 <= tilePos.getY()) && (tilePos.getY() < this.tiles.length)) {
			var tilerow = this.tiles[tilePos.getY()];
			tilerow.forEach(function (tile){if (tile.getTilePosition().getX() == tilePos.getX()) valid = true;});
		}
		return valid;
	}
	
	isWalkableTile(tilePos : TilePosition) : boolean {
		return this.isValidTile(tilePos); // TODO: Some materials will probably need to be "unwalkable".
	}
	
	constructor(name : String, tiles : Tile[][], initialTile : TilePosition) {this.name = name; this.tiles = tiles; this.initialTile = initialTile;}
}


export function drawTile(ctx : CanvasRenderingContext2D, translation : Vec2d, room : Room, tilePos : TilePosition) {	
	drawTileFloor(ctx, translation, room, tilePos);
	var tile = room.getTile(tilePos);
	tile.getDecor().forEach(function(decorum) {drawDecorum(ctx, translation, room, tilePos, decorum);});
}

export function drawTileFloor(ctx : CanvasRenderingContext2D, translation : Vec2d, room : Room, tilePos : TilePosition) {	
	var tile = room.getTile(tilePos);
	var pos = tile.getPosition();
	switch(tile.getMaterial()) {
		case TileMaterial.Blank: {
			break;
		}
			
		case TileMaterial.Solid: {
			ctx.fillStyle = tile.getMeta() as string;
			ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), TILESIZE, TILESIZE);
			break;
		}
			
		case TileMaterial.Chess: {
			ctx.fillStyle = "rgba(" + ((tilePos.getX()+tilePos.getY()) % 2 == 0 ? "255,255,255" : "0,0,0" ) + ")";
			ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), TILESIZE, TILESIZE);
			break;
		}
		
		case TileMaterial.Tiled : {
			ctx.drawImage(tiledImage, pos.getX() + translation.getX(), pos.getY() + translation.getY());	
		}
	}
}

export function drawTileDecor(ctx : CanvasRenderingContext2D, translation : Vec2d, room : Room, tilePos : TilePosition) {
	var tile = room.getTile(tilePos);
	tile.getDecor().forEach(function(decorum){drawDecorum(ctx,translation,room,tilePos,decorum);});
}

export function drawDecorum(ctx : CanvasRenderingContext2D, translation : Vec2d, room : Room, tilePos : TilePosition, decorum : Decorum){
	var tile = room.getTile(tilePos);
	var pos = tile.getPosition();
	switch(decorum.decorumObject) {
		case DecorumObject.Test: {
			ctx.drawImage(testImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - testImage.height + 32);
			break;
		}
		case DecorumObject.Wall1Top: {
			ctx.drawImage(wall1TopImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - wall1TopImage.height+64);
			break;
		}		
		case DecorumObject.GlassTop: {
			ctx.drawImage(glassTopImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - glassTopImage.height+64);
			break;
		}
		case DecorumObject.Blockade: {
			ctx.drawImage(blockadeImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - blockadeImage.height+32);
			break;
		}
		//case DecorumObject.Wall1Left: {
		//	ctx.drawImage(wall1LeftImage, pos.getX() + translation.getX(), pos.getY() + //translation.getY() - wall1LeftImage.height+90);
		//	break;
		//}
	}
}
