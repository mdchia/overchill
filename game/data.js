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
define(["require", "exports"], function (require, exports) {
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
        return TilePosition;
    }(Vec2d));
    exports.TilePosition = TilePosition;
});
//# sourceMappingURL=data.js.map