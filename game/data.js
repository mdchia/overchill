var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vec2d = (function () {
        function Vec2d(x, y) {
            this.x = x;
            this.y = y;
        }
        Vec2d.prototype.getX = function () { return this.x; };
        Vec2d.prototype.getY = function () { return this.y; };
        Vec2d.prototype.setX = function (x) { this.x = x; };
        Vec2d.prototype.setY = function (y) { this.y = y; };
        Vec2d.prototype.add = function (v2) { return new Vec2d(this.x + v2.x, this.y + v2.y); };
        Vec2d.prototype.sub = function (v2) { return new Vec2d(this.x - v2.x, this.y - v2.y); };
        Vec2d.prototype.mul = function (s) { return new Vec2d(this.x * s, this.y * s); };
        Vec2d.prototype.length = function () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); };
        Vec2d.prototype.normalise = function () {
            if (this.length() == 0)
                return new Vec2d(0, 0);
            else
                return new Vec2d(this.x / this.length(), this.y / this.length());
        };
        Vec2d.prototype.dot = function (v2) { return new Vec2d(this.x * v2.x, this.y * v2.y); };
        Vec2d.prototype.clone = function () { return new Vec2d(this.x, this.y); };
        Vec2d.prototype.max = function (s) {
            if (this.length() > s)
                return this.normalise().mul(s);
            return this.clone();
        };
        Vec2d.prototype.toTilePosition = function () {
            return new TilePosition(this.x / constants_1.TILESIZE, this.y / constants_1.TILESIZE);
        };
        Vec2d.prototype.getAngleDegrees = function () {
            return Math.atan2(this.getX(), this.getY()) * 180 / Math.PI;
        };
        Vec2d.prototype.getAngleRadians = function () {
            return Math.atan2(this.getX(), this.getY());
        };
        Vec2d.prototype.getDirection = function () {
            return (((Math.abs((this.getAngleDegrees() / 90) - 2)) % 4) * 2);
        };
        Vec2d.prototype.getCardinalDirection = function () {
            return (((Math.floor(Math.abs((this.getAngleDegrees() / 90) - 2))) % 4) * 2);
        };
        Vec2d.prototype.toString = function () { return "(" + this.getX() + ", " + this.getY() + ")"; };
        return Vec2d;
    }());
    exports.Vec2d = Vec2d;
    var TilePosition = (function (_super) {
        __extends(TilePosition, _super);
        function TilePosition(x, y) {
            return _super.call(this, Math.floor(x), Math.floor(y)) || this;
        }
        TilePosition.prototype.setX = function (x) { this.x = Math.floor(x); };
        TilePosition.prototype.setY = function (y) { this.y = Math.floor(y); };
        TilePosition.prototype.add = function (v2) { return new TilePosition(this.x + v2.x, this.y + v2.y); };
        TilePosition.prototype.toPosition = function () {
            return this.mul(constants_1.TILESIZE);
        };
        return TilePosition;
    }(Vec2d));
    exports.TilePosition = TilePosition;
    var HitBox = (function () {
        function HitBox(p1, p2) {
            this.topLeft = new Vec2d(Math.min(p1.getX(), p2.getX()), Math.min(p1.getY(), p2.getY()));
            this.botRight = new Vec2d(Math.max(p1.getX(), p2.getX()), Math.max(p1.getY(), p2.getY()));
        }
        HitBox.prototype.doesPointCollide = function (point) {
            return (this.topLeft.getX() <= point.getX()) && (point.getX() <= this.botRight.getX()) && (this.topLeft.getY() <= point.getY()) && (point.getY() <= this.botRight.getY());
        };
        HitBox.prototype.getCorners = function () {
            var corners;
            corners = [];
            corners.push(this.topLeft);
            corners.push(this.botRight);
            corners.push(new Vec2d(this.topLeft.getX(), this.botRight.getY()));
            corners.push(new Vec2d(this.botRight.getX(), this.topLeft.getY()));
            return corners;
        };
        HitBox.prototype.translate = function (p) {
            return new HitBox(this.topLeft.add(p), this.botRight.add(p));
        };
        HitBox.prototype.getTopLeft = function () { return this.topLeft; };
        HitBox.prototype.getBotRight = function () { return this.botRight; };
        HitBox.prototype.getTopRight = function () { new Vec2d(this.botRight.getX(), this.topLeft.getY()); };
        HitBox.prototype.getBotLeft = function () { new Vec2d(this.topLeft.getX(), this.botRight.getY()); };
        return HitBox;
    }());
    exports.HitBox = HitBox;
    var HitCircle = (function () {
        function HitCircle(centre, radius) {
            this.centre = centre;
            this.radius = radius;
        }
        HitCircle.prototype.doesPointCollide = function (point) {
            return point.sub(this.centre).length() <= this.radius;
        };
        HitCircle.prototype.translate = function (p) {
            return new HitCircle(this.centre.add(p), this.radius);
        };
        return HitCircle;
    }());
    exports.HitCircle = HitCircle;
    var HitTriangle = (function () {
        function HitTriangle(p1, p2, p3) {
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
        }
        HitTriangle.prototype.doesPointCollide = function (point) {
            var A = 1 / 2 * (-this.p1.getY() * this.p2.getX() + this.p3.getY() * (-this.p1.getX() + this.p2.getX()) + this.p3.getX() * (this.p1.getY() - this.p2.getY()) + this.p1.getX() * this.p2.getY());
            var sign = A < 0 ? -1 : 1;
            var s = (this.p3.getY() * this.p2.getX() - this.p3.getX() * this.p2.getY() + (this.p2.getY() - this.p3.getY()) * point.getX() + (this.p3.getX() - this.p2.getX()) * point.getY()) * sign;
            var t = (this.p3.getX() * this.p1.getY() - this.p3.getY() * this.p1.getX() + (this.p3.getY() - this.p1.getY()) * point.getX() + (this.p1.getX() - this.p3.getX()) * point.getY()) * sign;
            return s > 0 && t > 0 && (s + t) < 2 * A * sign;
        };
        HitTriangle.prototype.translate = function (p) {
            return new HitTriangle(this.p1.add(p), this.p2.add(p), this.p3.add(p));
        };
        return HitTriangle;
    }());
    exports.HitTriangle = HitTriangle;
    function doesCollide(s1, s2) {
        switch (s1.constructor.name) {
            case "HitBox": {
                switch (s2.constructor.name) {
                    case "HitBox": {
                        var hit = false;
                        s2.getCorners().forEach(function (p) { hit = hit || s1.doesPointCollide(p); });
                        return hit;
                        break;
                    }
                    case "HitCircle": {
                        return false;
                        break;
                    }
                    case "HitTriangle": {
                        return false;
                        break;
                    }
                }
                break;
            }
            case "HitCircle": {
                switch (s2.constructor.name) {
                    case "HitBox": {
                        return false;
                        break;
                    }
                    case "HitCircle": {
                        return false;
                        break;
                    }
                    case "HitTriangle": {
                        return false;
                        break;
                    }
                }
                break;
            }
            case "HitTriangle": {
                switch (s2.constructor.name) {
                    case "HitBox": {
                        return false;
                        break;
                    }
                    case "HitCircle": {
                        return false;
                        break;
                    }
                    case "HitTriangle": {
                        return false;
                        break;
                    }
                }
                break;
            }
        }
    }
    exports.doesCollide = doesCollide;
});
//# sourceMappingURL=data.js.map