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
define(["require", "exports", "./data", "./direction"], function (require, exports, data_1, direction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Entity = (function () {
        function Entity(name, pos, velo, direction, dimensions, hs) {
            this.name = name;
            this.pos = pos;
            this.velo = velo;
            this.direction = direction;
            this.dimensions = dimensions;
            this.hitshape = hs;
        }
        Entity.prototype.getHitShape = function () { return this.getBaseHitShape().translate(this.getPosition()); };
        Entity.prototype.getBaseHitShape = function () { return this.hitshape; };
        Entity.prototype.setBaseHitShape = function (hs) { this.hitshape = hs; };
        Entity.prototype.getPosition = function () { return this.pos; };
        Entity.prototype.getVelocity = function () { return this.velo; };
        Entity.prototype.setPosition = function (pos) { this.pos = pos; };
        Entity.prototype.setVelocity = function (velo) { this.velo = velo; };
        Entity.prototype.getDimensions = function () { return this.dimensions; };
        Entity.prototype.setDimensions = function (dim) { this.dimensions = dim; };
        Entity.prototype.getDirection = function () { return this.direction; };
        Entity.prototype.setDirection = function (direction) { this.direction = direction; };
        Entity.prototype.getTilePosition = function () { return this.getPosition().toTilePosition(); };
        Entity.prototype.update = function (room, deltaTime) {
            if (this.getVelocity().length() != 0) {
                var dest = this.getPosition().add(this.getVelocity().mul(deltaTime));
                var destTilePos = dest.toTilePosition();
                if (room.isWalkableTile(destTilePos)) {
                    var destTile = room.getTile(destTilePos);
                    var decorCollide = false;
                    var hs2 = this.getBaseHitShape().translate(dest);
                    destTile.getDecor().forEach(function (decorum) {
                        var hs1 = decorum.getHitShape().translate(destTilePos.toPosition());
                        if (data_1.doesCollide(hs1, hs2)) {
                            decorCollide = true;
                        }
                    });
                    if (!decorCollide) {
                        this.setPosition(this.getPosition().add(this.getVelocity().mul(deltaTime)));
                    }
                    else {
                        this.setVelocity(new data_1.Vec2d(0, 0));
                    }
                }
                else {
                    this.setVelocity(new data_1.Vec2d(0, 0));
                }
            }
        };
        return Entity;
    }());
    exports.Entity = Entity;
    var playerFrames;
    playerFrames = [];
    for (var i = 0; i < 4; i++) {
        playerFrames[i] = new Image();
        playerFrames[i].src = "res/player/frame" + i + ".png";
    }
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(name, pos, velo, direction) {
            return _super.call(this, name, pos, velo, direction, new data_1.Vec2d(32, 33), new data_1.HitBox(new data_1.Vec2d(0, 0), new data_1.Vec2d(32, 32))) || this;
        }
        Player.prototype.draw = function (ctx, translation) {
            var currentImage;
            switch (this.direction) {
                case direction_1.Cardinal.S: {
                    currentImage = playerFrames[0];
                    break;
                }
                case direction_1.Cardinal.W: {
                    currentImage = playerFrames[1];
                    break;
                }
                case direction_1.Cardinal.E: {
                    currentImage = playerFrames[2];
                    break;
                }
                case direction_1.Cardinal.N: {
                    currentImage = playerFrames[3];
                    break;
                }
                default: {
                    currentImage = currentImage = playerFrames[0];
                }
            }
            ctx.drawImage(currentImage, this.pos.getX() + translation.getX() - this.getDimensions().getX() / 2, this.pos.getY() + translation.getY() - currentImage.height);
        };
        return Player;
    }(Entity));
    exports.Player = Player;
});
//# sourceMappingURL=entities.js.map