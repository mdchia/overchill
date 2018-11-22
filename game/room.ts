import {Vec2d, TilePosition} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";
import {TILESIZE} from "./constants";


var tiledImage = new Image();
tiledImage.src = "res/tiled.png";

export enum TileMaterial {
	Blank = "blank",
	Solid = "solid",
	Chess = "chess",
	Tiled = "tiled"
}

export class Decorum {
	meta : String;
	direction : Cardinal;
	constructor(meta : String, direction : Cardinal) {this.meta = meta, this.direction = direction}
}

export class Tile {
	tilePosition : TilePosition;
	material : TileMaterial;
	meta : String;
	decor : Decorum[];
	
	getMaterial() {return this.material;}
	getMeta() {return this.meta;}
	
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
	
	constructor(name : String, tiles : Tile[][], initialTile : TilePosition) {this.name = name; this.tiles = tiles; this.initialTile = initialTile;}
}

export function drawTile(ctx : CanvasRenderingContext2D, translation : Vec2d, room : Room, tilePos : TilePosition)
{	
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