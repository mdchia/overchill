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
    var EntityState;
    (function (EntityState) {
        EntityState[EntityState["Standing"] = 0] = "Standing";
        EntityState[EntityState["Idle"] = 1] = "Idle";
        EntityState[EntityState["Walking"] = 2] = "Walking";
        EntityState[EntityState["Running"] = 3] = "Running";
    })(EntityState = exports.EntityState || (exports.EntityState = {}));
    var Entity = (function () {
        function Entity(name, pos, velo, direction, dimensions, hs, state, frame) {
            this.name = name;
            this.pos = pos;
            this.velo = velo;
            this.direction = direction;
            this.dimensions = dimensions;
            this.hitshape = hs;
            this.state = state;
            this.frame = frame;
        }
        Entity.prototype.getDirection = function () { return this.direction; };
        Entity.prototype.setDirection = function (direction) { this.direction = direction; };
        Entity.prototype.getHitShape = function () { return this.getBaseHitShape().translate(this.getPosition()); };
        Entity.prototype.getBaseHitShape = function () { return this.hitshape; };
        Entity.prototype.setBaseHitShape = function (hs) { this.hitshape = hs; };
        Entity.prototype.getPosition = function () { return this.pos; };
        Entity.prototype.getVelocity = function () { return this.velo; };
        Entity.prototype.setPosition = function (pos) { this.pos = pos; };
        Entity.prototype.setVelocity = function (velo) { this.velo = velo; };
        Entity.prototype.getDimensions = function () { return this.dimensions; };
        Entity.prototype.setDimensions = function (dim) { this.dimensions = dim; };
        Entity.prototype.getState = function () { return this.state; };
        Entity.prototype.setState = function (state) { this.state = state; };
        Entity.prototype.getFrame = function () { return this.frame; };
        Entity.prototype.setFrame = function (frame) { this.frame = frame; };
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
    var numberOfFramesInEachAnimationCycle = [1, 0, 1, 0];
    var playerFrames;
    playerFrames = [];
    for (var state in EntityState) {
        if (!isNaN(Number(state))) {
            playerFrames[state] = [];
            for (var dir in direction_1.Cardinal) {
                if (!isNaN(Number(dir))) {
                    playerFrames[state][dir] = [];
                    for (var frame = 0; frame < numberOfFramesInEachAnimationCycle[state]; frame++) {
                        playerFrames[state][dir][frame] = new Image();
                        playerFrames[state][dir][frame].src = "res/player/state" + state + "/dir" + dir + "/frame" + frame + ".png";
                    }
                }
            }
        }
    }
    var pestImage = new Image();
    pestImage.src = "res/blob.png";
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(name, pos, velo, direction, state, frame) {
            return _super.call(this, name, pos, velo, direction, new data_1.Vec2d(32, 33), new data_1.HitBox(new data_1.Vec2d(0, 0), new data_1.Vec2d(32, 32)), state, frame) || this;
        }
        Player.prototype.draw = function (ctx, translation) {
            var currentImage;
            currentImage = playerFrames[this.getState()][this.getDirection()][Math.floor(this.frame)];
            ctx.drawImage(currentImage, this.pos.getX() + translation.getX() - this.getDimensions().getX() / 2, this.pos.getY() + translation.getY() - currentImage.height);
        };
        return Player;
    }(Entity));
    exports.Player = Player;
    var Pest = (function (_super) {
        __extends(Pest, _super);
        function Pest(name, pos, velo, direction, state, frame) {
            return _super.call(this, name, pos, velo, direction, new data_1.Vec2d(32, 33), new data_1.HitBox(new data_1.Vec2d(0, 0), new data_1.Vec2d(32, 32)), state, frame) || this;
        }
        Pest.prototype.draw = function (ctx, translation) {
            ctx.drawImage(pestImage, this.pos.getX() + translation.getX() - this.getDimensions().getX() / 2, this.pos.getY() + translation.getY() - pestImage.height);
        };
        return Pest;
    }(Entity));
    exports.Pest = Pest;
});
//# sourceMappingURL=entities.js.map