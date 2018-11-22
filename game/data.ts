import {TILESIZE} from "./constants";

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
	sub(v2 : Vec2d) {return new Vec2d(this.x-v2.x, this.y-v2.y);}
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
	
	toTilePosition() {
		return new TilePosition(this.x/TILESIZE, this.y/TILESIZE);
	}
	
	getAngleDegrees() {
		return Math.atan2(this.getX(), this.getY()) * 180 / Math.PI;
	}
	
	getAngleRadians() {
		return Math.atan2(this.getX(), this.getY());
	}
	
	getDirection(){
		return (((Math.abs((this.getAngleDegrees()/90) - 2)) % 4) *2);
	}
	
	getCardinalDirection(){
		return (((Math.floor(Math.abs((this.getAngleDegrees()/90) - 2))) % 4) *2);
	}
	
	toString(){return "(" + this.getX() + ", " + this.getY() + ")";}
	
}

export class TilePosition extends Vec2d {
	constructor(x: number, y: number) {super(Math.floor(x), Math.floor(y));}
	setX(x : number) {this.x = Math.floor(x);}
	setY(y : number) {this.y = Math.floor(y);}
	
	add(v2 : TilePosition) {return new TilePosition(this.x + v2.x, this.y+v2.y);}
	
	toPosition() {
		return this.mul(TILESIZE);
	}
}


//interface Collidable {
//	doesPointCollide : (point : Vec2d) => boolean;
	
//	doesCollide(c2 : Collidable) {
		
//	}
//}

export class HitBox {
	private topLeft : Vec2d;
	private botRight : Vec2d;
	
	constructor(p1 : Vec2d, p2 : Vec2d) {
		this.topLeft = new Vec2d(Math.min(p1.getX(), p2.getX()), Math.min(p1.getY(), p2.getY()));
		this.botRight = new Vec2d(Math.max(p1.getX(), p2.getX()), Math.max(p1.getY(), p2.getY()));
	}
	
	doesPointCollide(point : Vec2d) {
		return (this.topLeft.getX() <= point.getX()) && (point.getX() <= this.botRight.getX()) && (this.topLeft.getY() <= point.getY()) && (point.getY() <= this.botRight.getY());
	}
	
	getCorners(){
		var corners : Vec2d[];
		corners = [];
		corners.push(this.topLeft);
		corners.push(this.botRight);
		corners.push(new Vec2d(this.topLeft.getX(), this.botRight.getY()));
		corners.push(new Vec2d(this.botRight.getX(), this.topLeft.getY()));
		return corners;
	}
	
	translate(p : Vec2d) {
		return new HitBox(this.topLeft.add(p), this.botRight.add(p));
	}
	
	getTopLeft() {return this.topLeft;}
	getBotRight() {return this.botRight;}
	getTopRight() {new Vec2d(this.botRight.getX(), this.topLeft.getY());}
	getBotLeft() {new Vec2d(this.topLeft.getX(), this.botRight.getY());}
	
}

export class HitCircle {
	private centre : Vec2d;
	private radius : number;
	
	constructor(centre : Vec2d, radius : number) {
		this.centre = centre; 
		this.radius = radius;
	}
	
	doesPointCollide(point : Vec2d) {
		return point.sub(this.centre).length() <= this.radius;
	}
	
	translate(p : Vec2d) {
		return new HitCircle(this.centre.add(p), this.radius);
	}
}

export class HitTriangle {
	private p1 : Vec2d;
	private p2 : Vec2d;
	private p3 : Vec2d;
	
	constructor(p1 : Vec2d, p2 : Vec2d, p3 : Vec2d){
		this.p1 = p1; this.p2 = p2; this.p3 = p3;
	}
	
	doesPointCollide(point : Vec2d){
		var A = 1/2 * (-this.p1.getY() * this.p2.getX() + this.p3.getY() * (-this.p1.getX() + this.p2.getX()) + this.p3.getX() * (this.p1.getY() - this.p2.getY()) + this.p1.getX() * this.p2.getY());
		var sign = A < 0 ? -1 : 1;
		var s = (this.p3.getY() * this.p2.getX() - this.p3.getX() * this.p2.getY() + (this.p2.getY() - this.p3.getY()) * point.getX() + (this.p3.getX() - this.p2.getX()) * point.getY()) * sign;
		var t = (this.p3.getX() * this.p1.getY() - this.p3.getY() * this.p1.getX() + (this.p3.getY() - this.p1.getY()) * point.getX() + (this.p1.getX() - this.p3.getX()) * point.getY()) * sign;
		
		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	}
	
	translate(p : Vec2d) {
		return new HitTriangle(this.p1.add(p), this.p2.add(p), this.p3.add(p));
	}
}

export type HitShape = HitBox | HitCircle | HitTriangle;

// TODO: Flesh this out with other forms of collision.
export function doesCollide (s1 : HitShape, s2 : HitShape) : boolean {
	switch (s1.constructor.name) {
		case "HitBox" : {		
			switch (s2.constructor.name) {
				case "HitBox" : {
					var hit = false;
					(s2 as HitBox).getCorners().forEach(function (p) {hit = hit || s1.doesPointCollide(p);});
					return hit;
					break;
				}
				case "HitCircle" : {
					return false;
					break;
				}
				case "HitTriangle" : {
					return false;
					break;
				}
			}
			break;
		}
		case "HitCircle" : {
			switch (s2.constructor.name) {
				case "HitBox" : {
					return false;
					break;
				}
				case "HitCircle" : {
					return false;
					break;
				}
				case "HitTriangle" : {
					return false;
					break;
				}
			}
			break;
		}
		case "HitTriangle" : {
			switch (s2.constructor.name) {
				case "HitBox" : {
					return false;
					break;
				}
				case "HitCircle" : {
					return false;
					break;
				}
				case "HitTriangle" : {
					return false;
					break;
				}
			}
			break;
		}
	}
}




