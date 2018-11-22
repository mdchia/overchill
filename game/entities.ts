import {Vec2d, TilePosition} from "./data";
import {Cardinal, Diagonal, Direction} from "./direction";

interface updatable {
	update: () => void;
}

export abstract class Entity implements updatable {
	name: String;
	pos: Vec2d;
	velo: Vec2d;
	direction : Direction;
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction){
		this.name = name; this.pos = pos; this.velo = velo; this.direction = direction;
	}
	
	getPosition() {return this.pos;}
	getVelocity() {return this.velo;}
	setPosition(pos : Vec2d) {this.pos = pos;}
	setVelocity(velo : Vec2d) {this.velo = velo;}
	
	update() {this.setPosition(this.getPosition().add(this.getVelocity()));}
}

export class Player extends Entity{
	constructor(name : String, pos : Vec2d, velo : Vec2d, direction : Direction){
		super(name, pos, velo, direction);
	}
}