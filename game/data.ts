/* General data structures */ 

export class Vec2d {
	protected x: number;
	protected y: number;
	constructor(x: number, y: number) {this.x = x; this.y = y;}
	
	getX() {return this.x;}
	getY() {return this.y;}
	setX(x : number) {this.x = x;}
	setY(y : number) {this.y = y;}
	
	add(v2 : Vec2d) {return new Vec2d(this.x+v2.x, this.y+v2.y);}
	mul(s : number) {return new Vec2d(this.x*s, this.y*s);}
	length() {return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));}
	normalise() {
		if (this.length() == 0)
			return new Vec2d(0,0);
		else
			return new Vec2d(this.x/this.length(), this.y/this.length());
	}
	dot(v2 : Vec2d) {return new Vec2d(this.x*v2.x, this.y*v2.y);}
	clone() {return new Vec2d(this.x, this.y);}
	max(s : number) {
		if (this.length() > s) 
			return this.normalise().mul(s);
		return this.clone();
	}
}

export class TilePosition extends Vec2d {
	constructor(x: number, y: number) {super(Math.floor(x), Math.floor(y));}
	setX(x : number) {this.x = Math.floor(x);}
	setY(y : number) {this.y = Math.floor(y);}
	
	add(v2 : TilePosition) {return new TilePosition(this.x + v2.x, this.y+v2.y);}
}