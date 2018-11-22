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
    var Entity = (function () {
        function Entity(name, pos, velo, direction) {
            this.name = name;
            this.pos = pos;
            this.velo = velo;
            this.direction = direction;
        }
        Entity.prototype.getPosition = function () { return this.pos; };
        Entity.prototype.getVelocity = function () { return this.velo; };
        Entity.prototype.setPosition = function (pos) { this.pos = pos; };
        Entity.prototype.setVelocity = function (velo) { this.velo = velo; };
        Entity.prototype.update = function () { this.setPosition(this.getPosition().add(this.getVelocity())); };
        return Entity;
    }());
    exports.Entity = Entity;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(name, pos, velo, direction) {
            return _super.call(this, name, pos, velo, direction) || this;
        }
        return Player;
    }(Entity));
    exports.Player = Player;
});
//# sourceMappingURL=entities.js.map