define(["require", "exports", "./data", "./constants"], function (require, exports, data_1, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tiledImage = new Image();
    tiledImage.src = "res/tiled.png";
    var TileMaterial;
    (function (TileMaterial) {
        TileMaterial["Blank"] = "blank";
        TileMaterial["Solid"] = "solid";
        TileMaterial["Chess"] = "chess";
        TileMaterial["Tiled"] = "tiled";
    })(TileMaterial = exports.TileMaterial || (exports.TileMaterial = {}));
    var Decorum = (function () {
        function Decorum(meta, direction) {
            this.meta = meta, this.direction = direction;
        }
        return Decorum;
    }());
    exports.Decorum = Decorum;
    var Tile = (function () {
        function Tile(tilePosition, material, meta, decor) {
            this.tilePosition = tilePosition;
            this.material = material;
            this.meta = meta;
            this.decor = decor;
        }
        Tile.prototype.getMaterial = function () { return this.material; };
        Tile.prototype.getMeta = function () { return this.meta; };
        Tile.prototype.getTilePosition = function () { return this.tilePosition; };
        Tile.prototype.getPosition = function () { return this.tilePosition.mul(constants_1.TILESIZE); };
        Tile.prototype.getCentre = function () { return this.tilePosition.mul(constants_1.TILESIZE).add(new data_1.Vec2d(constants_1.TILESIZE / 2, constants_1.TILESIZE / 2)); };
        return Tile;
    }());
    exports.Tile = Tile;
    var Room = (function () {
        function Room(name, tiles, initialTile) {
            this.name = name;
            this.tiles = tiles;
            this.initialTile = initialTile;
        }
        Room.prototype.getTiles = function () { return this.tiles; };
        ;
        Room.prototype.getTile = function (p) { return this.tiles[p.getY()][p.getX()]; };
        Room.prototype.getInitialTile = function () { return this.tiles[this.initialTile.getY()][this.initialTile.getX()]; };
        ;
        Room.prototype.getTileDimension = function () {
            var largeX = 0;
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].length > largeX)
                    largeX = this.tiles[i].length;
            }
            return new data_1.TilePosition(largeX, this.tiles.length);
        };
        Room.prototype.getDimension = function () {
            return this.getTileDimension().mul(constants_1.TILESIZE);
        };
        return Room;
    }());
    exports.Room = Room;
    function drawTile(ctx, translation, room, tilePos) {
        var tile = room.getTile(tilePos);
        var pos = tile.getPosition();
        switch (tile.getMaterial()) {
            case TileMaterial.Blank: {
                break;
            }
            case TileMaterial.Solid: {
                ctx.fillStyle = tile.getMeta();
                ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), constants_1.TILESIZE, constants_1.TILESIZE);
                break;
            }
            case TileMaterial.Chess: {
                ctx.fillStyle = "rgba(" + ((tilePos.getX() + tilePos.getY()) % 2 == 0 ? "255,255,255" : "0,0,0") + ")";
                ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), constants_1.TILESIZE, constants_1.TILESIZE);
                break;
            }
            case TileMaterial.Tiled: {
                ctx.drawImage(tiledImage, pos.getX() + translation.getX(), pos.getY() + translation.getY());
            }
        }
    }
    exports.drawTile = drawTile;
});
//# sourceMappingURL=room.js.map